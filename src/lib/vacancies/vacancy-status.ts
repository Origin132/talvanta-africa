import type { VacancyStatus } from "@/lib/supabase/database.types";

export const vacancyStatuses: readonly VacancyStatus[] = ["draft", "published", "closing-soon", "closed", "archived"];
export const publicVacancyStatuses: readonly VacancyStatus[] = ["published", "closing-soon"];
export const vacancyStatusLabels: Record<VacancyStatus, string> = { draft: "Draft", published: "Open", "closing-soon": "Closing Soon", closed: "Closed", archived: "Archived" };
export const vacancyTransitions = { draft: ["published"], published: ["closing-soon", "closed"], "closing-soon": ["closed"], closed: ["archived"], archived: [] } as const satisfies Record<VacancyStatus, readonly VacancyStatus[]>;
export type VacancyTargetStatus = (typeof vacancyTransitions)[keyof typeof vacancyTransitions][number];
export function isVacancyStatus(value: unknown): value is VacancyStatus { return typeof value === "string" && vacancyStatuses.includes(value as VacancyStatus); }
export function canTransitionVacancy(current: VacancyStatus, target: VacancyStatus): target is VacancyTargetStatus { return (vacancyTransitions[current] as readonly VacancyStatus[]).includes(target); }
