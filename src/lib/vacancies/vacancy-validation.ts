import { z } from "zod";
import { employmentTypes, workplaceTypes } from "@/lib/employers/recruitment-request-validation";

const optional = (max: number) => z.string().trim().max(max).transform((value) => value || null);
const list = z.string().trim().max(5000).transform((value) => [...new Set(value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))].slice(0, 50));
const fields = {
  jobTitle: z.string().trim().min(2, "Enter the job title.").max(200),
  organisationName: z.string().trim().min(2, "Enter the organisation name.").max(200),
  department: optional(200),
  employmentType: z.enum(employmentTypes, "Select an employment type."),
  workplaceType: z.enum(workplaceTypes, "Select a workplace type."),
  jobLocation: z.string().trim().min(2, "Enter the job location.").max(200),
  numberOfPositions: z.string().regex(/^\d+$/, "Enter a whole number from 1 to 1,000.").transform(Number).refine((value) => value >= 1 && value <= 1000, "Enter a whole number from 1 to 1,000."),
  salaryRange: optional(200),
  roleSummary: z.string().trim().min(1, "Enter a role summary.").max(5000),
  responsibilities: list,
  requiredSkills: list,
  requiredExperience: optional(2000),
  educationRequirements: optional(2000),
  applicationInstructions: optional(2000),
  closingDate: z.union([z.literal(""), z.iso.datetime({ local: true })]).transform((value) => value || null),
  applicationsOpen: z.boolean(),
};
export const vacancyFormFields = [...Object.keys(fields), "intent"] as const;
export const draftVacancySchema = z.strictObject(fields);
export const publishedVacancySchema = draftVacancySchema.superRefine((data, context) => {
  if (data.roleSummary.length < 20) context.addIssue({ code: "custom", path: ["roleSummary"], message: "Enter a role summary of at least 20 characters." });
  if (!data.responsibilities.length) context.addIssue({ code: "custom", path: ["responsibilities"], message: "Add at least one responsibility." });
  if (!data.requiredSkills.length) context.addIssue({ code: "custom", path: ["requiredSkills"], message: "Add at least one required skill." });
  if (!data.closingDate || new Date(data.closingDate).getTime() <= Date.now()) context.addIssue({ code: "custom", path: ["closingDate"], message: "Choose a future closing date before publishing." });
});
export type VacancyInput = z.infer<typeof draftVacancySchema>;
