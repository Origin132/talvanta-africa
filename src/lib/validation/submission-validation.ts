import type { FormErrors } from "@/types/forms";

export type ValidationResult = { valid: true } | { valid: false; fieldErrors: FormErrors; unsupportedShape?: boolean };
type JsonRecord = Record<string, unknown>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telephonePattern = /^\+?[0-9()\-\s.]{7,25}$/;

class Validator {
  readonly errors: FormErrors = {};
  constructor(private readonly data: JsonRecord) {}
  string(name: string, label: string, minimum: number, maximum: number, optional = false) {
    const raw = this.data[name];
    if (optional && (raw === undefined || raw === "")) return "";
    if (typeof raw !== "string") { this.errors[name] = `${label} must be text.`; return ""; }
    const value = raw.trim();
    if (!value) this.errors[name] = `Enter ${label.toLowerCase()}.`;
    else if (value.length < minimum) this.errors[name] = `${label} must be at least ${minimum} characters.`;
    else if (value.length > maximum) this.errors[name] = `${label} must be no more than ${maximum} characters.`;
    return value;
  }
  choice(name: string, label: string, allowed: readonly string[]) {
    const value = this.string(name, label, 1, 120);
    if (value && !allowed.includes(value)) this.errors[name] = `Select a valid ${label.toLowerCase()}.`;
  }
  integer(name: string, label: string, minimum: number, maximum: number) {
    const value = this.data[name];
    if (typeof value !== "number" || !Number.isInteger(value)) this.errors[name] = `${label} must be a whole number.`;
    else if (value < minimum || value > maximum) this.errors[name] = `${label} must be from ${minimum} to ${maximum}.`;
  }
  requiredBoolean(name: string, message: string) {
    if (this.data[name] !== true) this.errors[name] = message;
  }
  optionalBoolean(name: string) {
    const value = this.data[name];
    if (value !== undefined && typeof value !== "boolean") this.errors[name] = "Select a valid consent option.";
  }
  choices(name: string, label: string, allowed: readonly string[]) {
    const value = this.data[name];
    if (!Array.isArray(value) || value.length === 0) { this.errors[name] = `Select at least one ${label.toLowerCase()}.`; return; }
    if (value.some((item) => typeof item !== "string" || !allowed.includes(item)) || new Set(value).size !== value.length) this.errors[name] = `Select only valid, non-duplicate ${label.toLowerCase()} options.`;
  }
  email(name: string) {
    const value = this.string(name, "Email address", 3, 254);
    if (value && !emailPattern.test(value)) this.errors[name] = "Enter a valid email address.";
  }
  telephone(name: string) {
    const value = this.string(name, "Telephone number", 7, 25);
    if (value && (!telephonePattern.test(value) || value.replace(/\D/g, "").length < 7)) this.errors[name] = "Enter a valid telephone number with at least 7 digits.";
  }
  optionalTelephone(name: string) {
    const value = this.string(name, "Telephone number", 7, 25, true);
    if (value && (!telephonePattern.test(value) || value.replace(/\D/g, "").length < 7)) this.errors[name] = "Enter a valid telephone number with at least 7 digits.";
  }
  optionalUrl(name: string) {
    const value = this.string(name, "URL", 1, 300, true);
    if (!value) return;
    try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); }
    catch { this.errors[name] = "Enter a full valid URL beginning with http:// or https://."; }
  }
  optionalDate(name: string) {
    const value = this.string(name, "Preferred start date", 10, 10, true);
    if (!value) return;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) { this.errors[name] = "Enter a valid preferred start date."; return; }
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) { this.errors[name] = "Enter a valid preferred start date."; return; }
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (value < today) this.errors[name] = "Preferred start date cannot be in the past.";
  }
}

const employerKeys = ["organisationName", "contactPerson", "workEmail", "telephone", "website", "organisationLocation", "jobTitle", "department", "employmentType", "positions", "workplaceArrangement", "jobLocation", "preferredStartDate", "recruitmentTimeline", "responsibilities", "requiredSkills", "requiredExperience", "educationRequirements", "salaryRange", "additionalInformation", "preferredService", "recruitedBefore", "accuracyConsent", "outcomesConsent", "reviewConsent", "marketingConsent", "websiteConfirmation"] as const;
const candidateKeys = ["fullName", "email", "telephone", "currentLocation", "preferredLocation", "profileLink", "recentJobTitle", "employmentStatus", "experienceYears", "educationLevel", "areaOfStudy", "professionalQualifications", "keySkills", "experienceSummary", "industryExperience", "recentAchievements", "preferredEmploymentType", "workplacePreference", "preferredRoles", "salaryExpectation", "availability", "careerInterests", "cvSummary", "accuracyConsent", "outcomesConsent", "matchingConsent", "humanDecisionsConsent", "marketingConsent", "websiteConfirmation"] as const;
const contactKeys = ["fullName", "organisation", "email", "telephone", "enquiryType", "subject", "message", "consent", "websiteConfirmation"] as const;

export const allowedEmployerFields = new Set<string>(employerKeys);
export const allowedCandidateFields = new Set<string>(candidateKeys);
export const allowedContactFields = new Set<string>(contactKeys);

function finish(validator: Validator): ValidationResult {
  return Object.keys(validator.errors).length ? { valid: false, fieldErrors: validator.errors } : { valid: true };
}

export function validateEmployerSubmission(data: JsonRecord): ValidationResult {
  const v = new Validator(data);
  v.string("organisationName", "Organisation name", 2, 120); v.string("contactPerson", "Contact person", 2, 100); v.email("workEmail"); v.telephone("telephone"); v.optionalUrl("website"); v.string("organisationLocation", "Organisation location", 1, 120);
  v.string("jobTitle", "Job title", 2, 120); v.string("department", "Department or function", 1, 120, true); v.choice("employmentType", "Employment type", ["Permanent", "Temporary", "Contract", "Internship", "Graduate role", "Part-time", "Other"]); v.integer("positions", "Number of positions", 1, 500); v.choice("workplaceArrangement", "Workplace arrangement", ["On-site", "Hybrid", "Remote", "To be discussed"]); v.string("jobLocation", "Job location", 1, 120); v.optionalDate("preferredStartDate"); v.choice("recruitmentTimeline", "Recruitment timeline", ["As soon as possible", "Within 2 weeks", "Within 1 month", "Within 2–3 months", "More than 3 months", "Still planning"]);
  v.string("responsibilities", "Main responsibilities", 30, 2000); v.string("requiredSkills", "Required skills", 20, 1500); v.string("requiredExperience", "Required experience", 20, 1500); v.string("educationRequirements", "Education or professional requirements", 1, 1200, true); v.string("salaryRange", "Salary range", 1, 120, true); v.string("additionalInformation", "Additional information", 1, 2000, true);
  v.choice("preferredService", "Preferred service", ["Permanent Recruitment", "Temporary and Contract Staffing", "Executive Search", "Graduate Recruitment", "Candidate Screening", "HR Advisory", "Not sure"]); v.choice("recruitedBefore", "Recruited-before answer", ["Yes", "No", "Not sure"]);
  v.requiredBoolean("accuracyConsent", "Confirm that the information is accurate."); v.requiredBoolean("outcomesConsent", "Confirm that you understand the recruitment outcome statement."); v.requiredBoolean("reviewConsent", "Consent to recruitment-enquiry review and follow-up."); v.optionalBoolean("marketingConsent");
  return finish(v);
}

export function validateCandidateSubmission(data: JsonRecord): ValidationResult {
  const v = new Validator(data);
  v.string("fullName", "Full name", 2, 120); v.email("email"); v.telephone("telephone"); v.string("currentLocation", "Current location", 1, 120); v.string("preferredLocation", "Preferred work location", 1, 160); v.optionalUrl("profileLink");
  v.string("recentJobTitle", "Current or most recent job title", 2, 120); v.choice("employmentStatus", "Employment status", ["Employed", "Self-employed", "Unemployed", "Student", "Recent graduate", "Career break", "Other"]); v.integer("experienceYears", "Years of professional experience", 0, 60); v.choice("educationLevel", "Highest education level", ["Secondary education", "Diploma or certificate", "Bachelor’s degree", "Postgraduate diploma", "Master’s degree", "Doctorate", "Professional qualification", "Other"]); v.string("areaOfStudy", "Area of study", 1, 160, true); v.string("professionalQualifications", "Professional qualifications", 1, 1000, true);
  v.string("keySkills", "Key skills", 20, 1500); v.string("experienceSummary", "Experience summary", 40, 2500); v.string("industryExperience", "Industry experience", 1, 200); v.string("recentAchievements", "Recent responsibilities or achievements", 1, 2000, true);
  v.choices("preferredEmploymentType", "Preferred employment type", ["Permanent", "Temporary", "Contract", "Internship", "Graduate role", "Part-time"]); v.choices("workplacePreference", "Workplace preference", ["On-site", "Hybrid", "Remote", "Flexible"]); v.string("preferredRoles", "Preferred role or job titles", 10, 1000); v.string("salaryExpectation", "Salary expectation", 1, 120, true); v.choice("availability", "Availability", ["Immediately", "Within 2 weeks", "Within 1 month", "Within 2–3 months", "More than 3 months", "To be discussed"]); v.string("careerInterests", "Career interests", 1, 1500, true); v.string("cvSummary", "CV summary or selected career history", 1, 3000, true);
  v.requiredBoolean("accuracyConsent", "Confirm that the professional information is accurate."); v.requiredBoolean("outcomesConsent", "Confirm that you understand registration does not guarantee an outcome."); v.requiredBoolean("matchingConsent", "Consent to candidate-profile review and potential opportunity matching."); v.requiredBoolean("humanDecisionsConsent", "Confirm that employment decisions remain human-led."); v.optionalBoolean("marketingConsent");
  return finish(v);
}

export function validateContactSubmission(data: JsonRecord): ValidationResult {
  const v = new Validator(data);
  v.string("fullName", "Full name", 2, 120);
  v.string("organisation", "Organisation", 1, 120, true);
  v.email("email");
  v.optionalTelephone("telephone");
  v.choice("enquiryType", "Enquiry type", ["General enquiry", "Employer support", "Candidate support", "Recruitment services", "Partnership", "Privacy request", "Other"]);
  v.string("subject", "Subject", 3, 160);
  v.string("message", "Message", 20, 3000);
  v.requiredBoolean("consent", "Consent to enquiry processing and follow-up.");
  return finish(v);
}
