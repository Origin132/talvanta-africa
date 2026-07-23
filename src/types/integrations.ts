export type WebhookEnvironment = "development" | "production" | "test";

export type WebhookEnvelope<TData> = {
  eventType: "employer.hiring_enquiry.created" | "candidate.registration.created" | "contact.enquiry.created";
  schemaVersion: "1.0";
  submissionId: string;
  submittedAt: string;
  source: "talvanta-africa-website";
  environment: WebhookEnvironment;
  data: TData;
};

export type EmployerWebhookData = {
  organisationName: string; contactPerson: string; workEmail: string; telephone: string;
  organisationWebsite: string; organisationLocation: string; jobTitle: string; department: string;
  employmentType: string; numberOfPositions: number; workplaceArrangement: string; jobLocation: string;
  preferredStartDate: string; recruitmentTimeline: string; mainResponsibilities: string;
  requiredSkills: string; requiredExperience: string; educationRequirements: string;
  salaryRange: string; additionalInformation: string; preferredService: string; recruitedBefore: string;
  informationAccuracyConsent: true; serviceAgreementAcknowledgement: true; processingConsent: true;
  marketingConsent: boolean;
};

export type CandidateWebhookData = {
  fullName: string; email: string; telephone: string; currentLocation: string; preferredWorkLocation: string;
  professionalProfileUrl: string; currentJobTitle: string; employmentStatus: string; yearsOfExperience: number;
  highestEducationLevel: string; areaOfStudy: string; professionalQualifications: string; keySkills: string;
  experienceSummary: string; industryExperience: string; recentAchievements: string;
  preferredEmploymentTypes: string[]; workplacePreferences: string[]; preferredRoles: string;
  salaryExpectation: string; availability: string; careerInterests: string; cvSummary: string;
  informationAccuracyConsent: true; noGuaranteeAcknowledgement: true; processingConsent: true;
  humanDecisionAcknowledgement: true; marketingConsent: boolean;
};

export type ContactWebhookData = {
  fullName: string;
  organisation: string;
  email: string;
  telephone: string;
  enquiryType: string;
  subject: string;
  message: string;
  consent: true;
};

export type EmployerWebhookPayload = WebhookEnvelope<EmployerWebhookData>;
export type CandidateWebhookPayload = WebhookEnvelope<CandidateWebhookData>;
export type ContactWebhookPayload = WebhookEnvelope<ContactWebhookData>;
export type RecruitmentWebhookPayload = EmployerWebhookPayload | CandidateWebhookPayload | ContactWebhookPayload;

export type WebhookResult =
  | { success: true }
  | { success: false; category: "configuration" | "upstream" | "timeout" | "unavailable" | "unexpected"; upstreamStatus?: number };
