import "server-only";

import { z } from "zod";
import { requireAdmin } from "@/lib/admin/require-admin";
import type {
  EmployerProfile,
  RecruitmentRequest,
  RecruitmentRequestStatus,
} from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const requestColumns =
  "id, employer_user_id, organisation_name, job_title, department, employment_type, workplace_type, number_of_positions, job_location, preferred_start_date, recruitment_timeline, salary_range, role_summary, responsibilities, required_skills, required_experience, education_requirements, preferred_service, additional_information, status, submitted_at, withdrawn_at, created_at, updated_at";

export const adminReviewStatuses = [
  "submitted",
  "under-review",
  "clarification-required",
  "accepted",
  "declined",
  "withdrawn",
  "closed",
] as const satisfies readonly RecruitmentRequestStatus[];

export type AdminReviewStatus = (typeof adminReviewStatuses)[number];
export const ADMIN_PAGE_SIZE = 20;

export function isAdminReviewStatus(value: unknown): value is AdminReviewStatus {
  return (
    typeof value === "string" &&
    adminReviewStatuses.includes(value as AdminReviewStatus)
  );
}

export function parseAdminPage(value: unknown) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10_000) : 1;
}

export type AdminEmployerContext = {
  contactName: string | null;
  email: null;
  employer: Omit<EmployerProfile, "user_id" | "created_at" | "updated_at"> | null;
};

export type AdminRequestSummary = Omit<
  RecruitmentRequest,
  "employer_user_id"
> & {
  employer: AdminEmployerContext;
};

type EmployerContextMap = Map<string, AdminEmployerContext>;

async function loadEmployerContexts(
  employerIds: string[],
): Promise<{ contexts: EmployerContextMap; unavailable: boolean }> {
  const contexts: EmployerContextMap = new Map();
  if (!employerIds.length) return { contexts, unavailable: false };

  const supabase = await createClient();
  const uniqueIds = [...new Set(employerIds)];
  const [profilesResult, employersResult] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", uniqueIds),
    supabase
      .from("employer_profiles")
      .select(
        "user_id, organisation_name, organisation_website, industry, organisation_size, contact_role, phone, organisation_location, organisation_summary",
      )
      .in("user_id", uniqueIds),
  ]);

  if (profilesResult.error || employersResult.error) {
    return { contexts, unavailable: true };
  }

  const names = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.id, profile.full_name]),
  );
  const employers = new Map(
    (employersResult.data ?? []).map((employer) => [employer.user_id, employer]),
  );

  uniqueIds.forEach((id) => {
    const employer = employers.get(id);
    contexts.set(id, {
      contactName: names.get(id) ?? null,
      email: null,
      employer: employer
        ? {
            organisation_name: employer.organisation_name,
            organisation_website: employer.organisation_website,
            industry: employer.industry,
            organisation_size: employer.organisation_size,
            contact_role: employer.contact_role,
            phone: employer.phone,
            organisation_location: employer.organisation_location,
            organisation_summary: employer.organisation_summary,
          }
        : null,
    });
  });

  return { contexts, unavailable: false };
}

function withoutEmployerId(
  request: RecruitmentRequest,
  contexts: EmployerContextMap,
): AdminRequestSummary {
  const { employer_user_id: employerId, ...safeRequest } = request;
  return {
    ...safeRequest,
    employer: contexts.get(employerId) ?? {
      contactName: null,
      email: null,
      employer: null,
    },
  };
}

export async function getAdminDashboard() {
  const access = await requireAdmin("/admin");
  if (access.status !== "ready") return { status: access.status } as const;

  const supabase = await createClient();
  const count = (status: AdminReviewStatus) =>
    supabase
      .from("recruitment_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", status);

  const [submitted, reviewing, clarification, accepted, recent] =
    await Promise.all([
      count("submitted"),
      count("under-review"),
      count("clarification-required"),
      count("accepted"),
      supabase
        .from("recruitment_requests")
        .select(requestColumns)
        .neq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  if (
    submitted.error ||
    reviewing.error ||
    clarification.error ||
    accepted.error ||
    recent.error
  ) {
    return { status: "error" } as const;
  }

  const requests = (recent.data ?? []) as RecruitmentRequest[];
  const context = await loadEmployerContexts(
    requests.map((request) => request.employer_user_id),
  );

  return {
    status: "ready",
    counts: {
      submitted: submitted.count ?? 0,
      reviewing: reviewing.count ?? 0,
      clarification: clarification.count ?? 0,
      accepted: accepted.count ?? 0,
    },
    requests: requests.map((request) =>
      withoutEmployerId(request, context.contexts),
    ),
    contextUnavailable: context.unavailable,
  } as const;
}

export async function getAdminRequests(
  filter: AdminReviewStatus | null,
  page: number,
) {
  const access = await requireAdmin("/admin/recruitment-requests");
  if (access.status !== "ready") return { status: access.status } as const;

  const supabase = await createClient();
  const first = (page - 1) * ADMIN_PAGE_SIZE;
  let query = supabase
    .from("recruitment_requests")
    .select(requestColumns, { count: "exact" })
    .neq("status", "draft")
    .order("created_at", { ascending: false })
    .range(first, first + ADMIN_PAGE_SIZE - 1);
  if (filter) query = query.eq("status", filter);

  const result = await query;
  if (result.error) return { status: "error" } as const;

  const requests = (result.data ?? []) as RecruitmentRequest[];
  const context = await loadEmployerContexts(
    requests.map((request) => request.employer_user_id),
  );

  return {
    status: "ready",
    requests: requests.map((request) =>
      withoutEmployerId(request, context.contexts),
    ),
    contextUnavailable: context.unavailable,
    total: result.count ?? 0,
    page,
  } as const;
}

export async function getAdminRequest(id: string) {
  const access = await requireAdmin(`/admin/recruitment-requests/${id}`);
  if (access.status !== "ready") return { status: access.status } as const;

  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { status: "unavailable" } as const;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recruitment_requests")
    .select(requestColumns)
    .eq("id", parsed.data)
    .maybeSingle();
  if (error || !data) return { status: "unavailable" } as const;

  const request = data as RecruitmentRequest;
  const context = await loadEmployerContexts([request.employer_user_id]);
  return {
    status: "ready",
    request: withoutEmployerId(request, context.contexts),
    contextUnavailable: context.unavailable,
  } as const;
}
