import { z } from "zod";

const optional = (max = 200) => z.string().trim().max(max).transform((value) => value || null);
const optionalUrl = z.string().trim().max(500).refine((value) => !value || /^https:\/\//i.test(value), "Enter a complete HTTPS URL.").transform((value) => value || null);
const list = z.string().trim().max(1000).transform((value) => [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))].slice(0, 20));
export const employmentTypes = ["Permanent", "Contract", "Temporary", "Internship"] as const;
export const workplaceTypes = ["On-site", "Hybrid", "Remote"] as const;

const common = { fullName: z.string().trim().min(2, "Enter your full name.").max(100) };
export const candidateSchema = z.strictObject({ ...common, phone: optional(50), currentLocation: optional(), professionalTitle: optional(), yearsOfExperience: z.union([z.literal(""), z.string().regex(/^\d+$/)]).transform((value) => value === "" ? null : Number(value)).refine((value) => value === null || (value >= 0 && value <= 80), "Enter a whole number from 0 to 80."), professionalSummary: optional(5000), linkedinUrl: optionalUrl, portfolioUrl: optionalUrl, preferredRoles: list, preferredLocations: list, preferredEmploymentTypes: z.array(z.enum(employmentTypes)).max(employmentTypes.length), preferredWorkplaceTypes: z.array(z.enum(workplaceTypes)).max(workplaceTypes.length) });
export const employerSchema = z.strictObject({ ...common, organisationName: z.string().trim().min(2, "Enter the organisation name.").max(200), organisationWebsite: optionalUrl, industry: optional(), organisationSize: optional(100), contactRole: optional(), phone: optional(50), organisationLocation: optional(), organisationSummary: optional(5000) });

export type CandidateInput = z.infer<typeof candidateSchema>;
export type EmployerInput = z.infer<typeof employerSchema>;
