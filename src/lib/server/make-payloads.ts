import "server-only";
import type { CandidateWebhookPayload, ContactWebhookPayload, EmployerWebhookPayload, WebhookEnvironment } from "@/types/integrations";

type ValidatedRecord = Record<string, unknown>;
const text = (data: ValidatedRecord, key: string) => typeof data[key] === "string" ? data[key].trim() : "";
const number = (data: ValidatedRecord, key: string) => typeof data[key] === "number" ? data[key] : 0;
const boolean = (data: ValidatedRecord, key: string) => data[key] === true;
const list = (data: ValidatedRecord, key: string) => Array.isArray(data[key]) ? data[key].filter((item): item is string => typeof item === "string") : [];
const environment = (): WebhookEnvironment => process.env.NODE_ENV === "production" ? "production" : process.env.NODE_ENV === "test" ? "test" : "development";
const metadata = (submissionId: string) => ({ schemaVersion: "1.0" as const, submissionId, submittedAt: new Date().toISOString(), source: "talvanta-africa-website" as const, environment: environment() });

export function buildEmployerWebhookPayload(data: ValidatedRecord, submissionId: string): EmployerWebhookPayload {
  return { eventType: "employer.hiring_enquiry.created", ...metadata(submissionId), data: {
    organisationName: text(data, "organisationName"), contactPerson: text(data, "contactPerson"), workEmail: text(data, "workEmail"), telephone: text(data, "telephone"), organisationWebsite: text(data, "website"), organisationLocation: text(data, "organisationLocation"), jobTitle: text(data, "jobTitle"), department: text(data, "department"), employmentType: text(data, "employmentType"), numberOfPositions: number(data, "positions"), workplaceArrangement: text(data, "workplaceArrangement"), jobLocation: text(data, "jobLocation"), preferredStartDate: text(data, "preferredStartDate"), recruitmentTimeline: text(data, "recruitmentTimeline"), mainResponsibilities: text(data, "responsibilities"), requiredSkills: text(data, "requiredSkills"), requiredExperience: text(data, "requiredExperience"), educationRequirements: text(data, "educationRequirements"), salaryRange: text(data, "salaryRange"), additionalInformation: text(data, "additionalInformation"), preferredService: text(data, "preferredService"), recruitedBefore: text(data, "recruitedBefore"), informationAccuracyConsent: true, serviceAgreementAcknowledgement: true, processingConsent: true, marketingConsent: boolean(data, "marketingConsent"),
  } };
}

export function buildCandidateWebhookPayload(data: ValidatedRecord, submissionId: string): CandidateWebhookPayload {
  return { eventType: "candidate.registration.created", ...metadata(submissionId), data: {
    fullName: text(data, "fullName"), email: text(data, "email"), telephone: text(data, "telephone"), currentLocation: text(data, "currentLocation"), preferredWorkLocation: text(data, "preferredLocation"), professionalProfileUrl: text(data, "profileLink"), currentJobTitle: text(data, "recentJobTitle"), employmentStatus: text(data, "employmentStatus"), yearsOfExperience: number(data, "experienceYears"), highestEducationLevel: text(data, "educationLevel"), areaOfStudy: text(data, "areaOfStudy"), professionalQualifications: text(data, "professionalQualifications"), keySkills: text(data, "keySkills"), experienceSummary: text(data, "experienceSummary"), industryExperience: text(data, "industryExperience"), recentAchievements: text(data, "recentAchievements"), preferredEmploymentTypes: list(data, "preferredEmploymentType"), workplacePreferences: list(data, "workplacePreference"), preferredRoles: text(data, "preferredRoles"), salaryExpectation: text(data, "salaryExpectation"), availability: text(data, "availability"), careerInterests: text(data, "careerInterests"), cvSummary: text(data, "cvSummary"), informationAccuracyConsent: true, noGuaranteeAcknowledgement: true, processingConsent: true, humanDecisionAcknowledgement: true, marketingConsent: boolean(data, "marketingConsent"),
  } };
}

export function buildContactWebhookPayload(data: ValidatedRecord, submissionId: string): ContactWebhookPayload {
  return { eventType: "contact.enquiry.created", ...metadata(submissionId), data: {
    fullName: text(data, "fullName"), organisation: text(data, "organisation"),
    email: text(data, "email"), telephone: text(data, "telephone"),
    enquiryType: text(data, "enquiryType"), subject: text(data, "subject"),
    message: text(data, "message"), consent: true,
  } };
}
