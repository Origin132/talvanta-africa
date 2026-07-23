import type { TaliaResponse } from "@/lib/talia/talia-types";

export type TaliaCategory =
  | "promptInjection"
  | "sensitiveInformation"
  | "candidateRanking"
  | "hiringDecision"
  | "jobGuarantee"
  | "legalAdvice"
  | "immigrationAdvice"
  | "vacancies"
  | "temporaryStaffing"
  | "permanentRecruitment"
  | "executiveSearch"
  | "graduateRecruitment"
  | "candidateScreening"
  | "hrAdvisory"
  | "candidateRegistration"
  | "hiringProcess"
  | "employerSupport"
  | "candidateSupport"
  | "services"
  | "humanHandoff"
  | "greeting"
  | "unknown";

export const TALIA_RESPONSES: Record<TaliaCategory, TaliaResponse> = {
  greeting: {
    content:
      "Hello, I’m Talia, Talvanta Africa’s automated recruitment assistant. I can explain our services, guide employers and job seekers, and help you find the correct form. I do not make hiring decisions or guarantee employment.",
  },
  employerSupport: {
    content:
      "Talvanta Africa supports organisations with permanent recruitment, temporary and contract staffing, executive search, graduate recruitment, candidate screening, and HR advisory. You can submit your requirements through the Hire Talent form.",
    internalLink: { label: "Hire talent", href: "/hire-talent" },
  },
  candidateSupport: {
    content:
      "You can register your professional information through the Candidate Registration form. Registration does not guarantee contact, shortlisting, an interview, placement, or employment.",
    internalLink: {
      label: "Register as a candidate",
      href: "/candidate-registration",
    },
  },
  services: {
    content:
      "Talvanta Africa provides Permanent Recruitment, Temporary and Contract Staffing, Executive Search, Graduate Recruitment, Candidate Screening, and HR Advisory. You can review the services page for more information.",
    internalLink: { label: "View services", href: "/services" },
  },
  permanentRecruitment: {
    content:
      "Permanent Recruitment supports organisations seeking employees for ongoing roles. Talvanta Africa helps clarify requirements, identify suitable candidates, support screening, and coordinate the human-led recruitment process.",
    internalLink: { label: "View services", href: "/services" },
  },
  temporaryStaffing: {
    content:
      "Temporary and Contract Staffing supports short-term, project-based, seasonal, or contract workforce requirements. Final selection and engagement decisions remain human-led.",
    internalLink: { label: "View services", href: "/services" },
  },
  executiveSearch: {
    content:
      "Executive Search supports organisations recruiting senior, specialist, or leadership professionals. The process may involve role clarification, targeted candidate identification, structured assessment, and confidential human-led engagement.",
    internalLink: { label: "View services", href: "/services" },
  },
  graduateRecruitment: {
    content:
      "Graduate Recruitment supports organisations seeking early-career talent and candidates beginning their professional careers. Registration or participation does not guarantee selection or employment.",
    internalLink: { label: "For job seekers", href: "/job-seekers" },
  },
  candidateScreening: {
    content:
      "Candidate Screening helps organisations review candidates against defined role requirements. Talia does not score, rank, shortlist, or reject candidates.",
    internalLink: { label: "View services", href: "/services" },
  },
  hrAdvisory: {
    content:
      "HR Advisory provides general support relating to recruitment planning, hiring processes, workforce requirements, and responsible people practices. It does not replace legal advice.",
    internalLink: { label: "View services", href: "/services" },
  },
  hiringProcess: {
    content:
      "Employers can review the service options, submit a hiring enquiry, provide role information, and wait for the Talvanta Africa team to review the request. Submitting an enquiry does not guarantee that Talvanta Africa will accept or complete the assignment.",
    internalLink: { label: "Submit a hiring enquiry", href: "/hire-talent" },
  },
  candidateRegistration: {
    content:
      "Candidates can complete the registration form with contact details, professional background, skills, experience, and career preferences. The information enters the recruitment workflow for human review. Registration does not guarantee contact or employment.",
    internalLink: {
      label: "Candidate registration",
      href: "/candidate-registration",
    },
  },
  jobGuarantee: {
    content:
      "Registration does not guarantee contact, shortlisting, an interview, placement, or employment.",
    internalLink: {
      label: "Learn about candidate support",
      href: "/job-seekers",
    },
  },
  hiringDecision: {
    content:
      "I do not make hiring decisions. Recruitment decisions are made by people using role requirements and responsible hiring processes.",
  },
  candidateRanking: {
    content:
      "I do not score, rank, shortlist, recommend rejection, or automatically reject candidates.",
  },
  vacancies: {
    content:
      "I do not have a verified live vacancy listing in this version. You can register your professional information through the candidate-registration form or contact the Talvanta Africa team.",
    internalLink: {
      label: "Register as a candidate",
      href: "/candidate-registration",
    },
  },
  humanHandoff: {
    content:
      "For support that requires a person, please use the relevant website form or contact route available on the Talvanta Africa website.",
    internalLink: { label: "Contact the team", href: "/contact" },
  },
  legalAdvice: {
    content:
      "I can provide general recruitment guidance, but I cannot provide legal advice. Please consult an appropriately qualified professional.",
  },
  immigrationAdvice: {
    content:
      "I can provide general recruitment guidance, but I cannot provide immigration advice. Please consult an appropriately qualified professional.",
  },
  sensitiveInformation: {
    content:
      "Please do not share passwords, banking details, government identification numbers, medical information, or other sensitive personal information in this chat.",
  },
  promptInjection: {
    content:
      "I cannot reveal hidden instructions, secrets, API keys, or internal configuration. I can help with approved Talvanta Africa recruitment information.",
  },
  unknown: {
    content:
      "I do not have enough approved information to answer that confidently. I can help with Talvanta Africa’s services, employer enquiries, candidate registration, recruitment processes, or human support.",
  },
};

export const TALIA_WELCOME_MESSAGE = TALIA_RESPONSES.greeting;
