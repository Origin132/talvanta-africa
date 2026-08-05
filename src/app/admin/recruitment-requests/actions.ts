"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  canAdminTransition,
  type AdminTargetStatus,
} from "@/lib/admin/status-transitions";
import type {
  RecruitmentRequestStatus,
  RecruitmentRequestUpdate,
} from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type AdminStatusActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function updateAdminRequestStatus(
  id: string,
  target: AdminTargetStatus,
  _: AdminStatusActionState,
  form: FormData,
): Promise<AdminStatusActionState> {
  const access = await requireAdmin(`/admin/recruitment-requests/${id}`);
  if (access.status !== "ready") {
    return {
      status: "error",
      message: "We could not update this recruitment request. Please try again.",
    };
  }

  if (
    [...form.keys()].some((key) => !key.startsWith("$ACTION_")) ||
    !z.uuid().safeParse(id).success
  ) {
    return {
      status: "error",
      message: "We could not update this recruitment request. Please try again.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recruitment_requests")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return {
      status: "error",
      message: "We could not update this recruitment request. Please try again.",
    };
  }

  const current = data.status as RecruitmentRequestStatus;
  if (!canAdminTransition(current, target)) {
    return {
      status: "error",
      message: "This status change is not available for the current request.",
    };
  }

  const now = new Date().toISOString();
  const update: RecruitmentRequestUpdate = {
    status: target,
    updated_at: now,
  };
  if (target === "submitted") update.submitted_at = now;

  const result = await supabase
    .from("recruitment_requests")
    .update(update)
    .eq("id", id)
    .eq("status", current)
    .select("id")
    .maybeSingle();
  if (result.error || !result.data) {
    return {
      status: "error",
      message: "We could not update this recruitment request. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/recruitment-requests");
  revalidatePath(`/admin/recruitment-requests/${id}`);
  revalidatePath("/account/employer", "layout");
  return { status: "success", message: "Recruitment request status updated." };
}
