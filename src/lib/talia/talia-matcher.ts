import {
  TALIA_RESPONSES,
  type TaliaCategory,
} from "@/lib/talia/mock-responses";
import type { TaliaResponse } from "@/lib/talia/talia-types";

type MatchingRule = {
  category: TaliaCategory;
  phrases: readonly string[];
};

const rules: readonly MatchingRule[] = [
  {
    category: "promptInjection",
    phrases: [
      "system prompt",
      "hidden instructions",
      "ignore previous instructions",
      "ignore your instructions",
      "api key",
      "reveal your rules",
      "developer message",
      "internal configuration",
    ],
  },
  {
    category: "sensitiveInformation",
    phrases: [
      "passport number",
      "bank details",
      "password",
      "national id",
      "government identification",
      "medical information",
      "account number",
      "card number",
    ],
  },
  {
    category: "candidateRanking",
    phrases: [
      "rank candidates",
      "rank these candidates",
      "score candidates",
      "shortlist candidates",
      "reject candidate",
      "reject this candidate",
      "best candidate",
      "recommend rejection",
    ],
  },
  {
    category: "hiringDecision",
    phrases: [
      "decide who to hire",
      "hiring decision",
      "choose a candidate",
      "tell me who to hire",
      "which applicant to hire",
    ],
  },
  {
    category: "jobGuarantee",
    phrases: [
      "guarantee a job",
      "guaranteed employment",
      "will i get a job",
      "promise me a job",
      "guarantee placement",
      "registration guarantee",
    ],
  },
  {
    category: "legalAdvice",
    phrases: ["legal advice", "employment law", "legal guidance"],
  },
  {
    category: "immigrationAdvice",
    phrases: ["immigration advice", "visa advice", "work permit"],
  },
  {
    category: "vacancies",
    phrases: [
      "vacancies",
      "jobs available",
      "current jobs",
      "open roles",
      "job openings",
      "live vacancy",
    ],
  },
  {
    category: "temporaryStaffing",
    phrases: [
      "temporary",
      "contract staffing",
      "temporary staff",
      "contract worker",
      "contract employee",
      "short term staff",
    ],
  },
  {
    category: "permanentRecruitment",
    phrases: ["permanent recruitment", "permanent role", "permanent employee"],
  },
  {
    category: "executiveSearch",
    phrases: [
      "executive search",
      "senior hire",
      "leadership recruitment",
      "director recruitment",
    ],
  },
  {
    category: "graduateRecruitment",
    phrases: [
      "graduate recruitment",
      "graduate role",
      "entry level",
      "recent graduate",
    ],
  },
  {
    category: "candidateScreening",
    phrases: [
      "candidate screening",
      "screen candidates",
      "background screening",
      "assess candidates",
    ],
  },
  {
    category: "hrAdvisory",
    phrases: [
      "hr advisory",
      "hr advice",
      "workforce planning",
      "recruitment planning",
    ],
  },
  {
    category: "candidateRegistration",
    phrases: [
      "candidate registration process",
      "candidate registration work",
      "how do i register",
      "registration form",
    ],
  },
  {
    category: "hiringProcess",
    phrases: [
      "hiring process",
      "how do i hire",
      "submit a hiring enquiry",
      "submit hiring enquiry",
      "how does talvanta africa work",
    ],
  },
  {
    category: "employerSupport",
    phrases: [
      "i want to hire",
      "hire staff",
      "hiring",
      "employer",
      "recruit staff",
      "find employees",
      "need workers",
      "need staff",
    ],
  },
  {
    category: "candidateSupport",
    phrases: [
      "i am looking for work",
      "job seeker",
      "looking for work",
      "register",
      "candidate",
      "submit cv",
      "find a job",
      "employment",
    ],
  },
  {
    category: "services",
    phrases: [
      "explore recruitment services",
      "services",
      "what do you offer",
      "recruitment services",
      "how can you help",
    ],
  },
  {
    category: "humanHandoff",
    phrases: [
      "speak to the team",
      "contact",
      "human support",
      "speak to a person",
      "talk to someone",
    ],
  },
  {
    category: "greeting",
    phrases: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
  },
];

function normaliseMessage(message: string) {
  return message
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getMockTaliaResponse(message: string): TaliaResponse {
  const normalised = normaliseMessage(message);
  const match = rules.find((rule) =>
    rule.phrases.some((phrase) => normalised.includes(phrase)),
  );

  return TALIA_RESPONSES[match?.category ?? "unknown"];
}
