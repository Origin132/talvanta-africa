export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  name: string;
  items: readonly FaqItem[];
};

export const faqCategories: readonly FaqCategory[] = [
  {
    name: "General",
    items: [
      { question: "What is Talvanta Africa?", answer: "Talvanta Africa is an AI-powered HR recruitment and talent-solutions company connecting qualified professionals with growing businesses across Nigeria and Africa." },
      { question: "Who can use this website?", answer: "Employers, job seekers, and visitors seeking information about Talvanta Africa’s recruitment services can use the public website." },
      { question: "How can I contact the team?", answer: "Use the contact form for general, partnership, privacy, or website enquiries. Employers and candidates should use their dedicated forms where appropriate." },
      { question: "Are all website services live?", answer: "This website is a demonstration project. Features and placeholder content are identified, and external workflows operate only when separately configured." },
    ],
  },
  {
    name: "Employers",
    items: [
      { question: "How do I request recruitment support?", answer: "Complete the Hire Talent form with organisation, role, requirements, and consent information for review." },
      { question: "Does submitting a hiring enquiry create a service agreement?", answer: "No. A submission does not create a service agreement or guarantee candidate availability or recruitment success." },
      { question: "Which recruitment services are available?", answer: "Services presented on the website include Permanent Recruitment, Temporary and Contract Staffing, Executive Search, Graduate Recruitment, Candidate Screening, and HR Advisory." },
      { question: "Who makes the final hiring decision?", answer: "Employers and authorised people make hiring decisions. Technology and Talia do not make final recruitment decisions." },
    ],
  },
  {
    name: "Job Seekers",
    items: [
      { question: "How do I register as a candidate?", answer: "Use the Candidate Registration form to provide your professional background, skills, experience, preferences, and required acknowledgements." },
      { question: "Does registration guarantee a job?", answer: "No. Registration does not guarantee contact, shortlisting, an interview, placement, or employment." },
      { question: "Can I upload a CV?", answer: "No. File uploads and CV analysis are not available in the current website version." },
      { question: "Will Talia assess my suitability?", answer: "No. Talia does not score, rank, shortlist, or reject candidates." },
    ],
  },
  {
    name: "Recruitment",
    items: [
      { question: "How does the recruitment process begin?", answer: "An employer submits role information or a candidate registers professional information. Relevant information may then be reviewed by people within the configured recruitment workflow." },
      { question: "What is Permanent Recruitment?", answer: "It supports organisations seeking employees for ongoing roles through role clarification, candidate identification, screening support, and human-led recruitment." },
      { question: "What is Executive Search?", answer: "It supports senior, specialist, or leadership recruitment through targeted identification, structured assessment, and human-led engagement." },
      { question: "Does candidate screening mean automatic rejection?", answer: "No. Candidate screening supports review against role requirements; final decisions remain human-led." },
    ],
  },
  {
    name: "AI Assistant",
    items: [
      { question: "What is Talia?", answer: "Talia is currently a rule-based automated website assistant that provides approved recruitment information and navigation guidance." },
      { question: "Is Talia a human recruiter?", answer: "No. Talia is not human and does not claim to be a recruiter or hiring manager." },
      { question: "Does Talia use live generative AI?", answer: "No. The current demonstration selects deterministic approved responses and does not call an external AI service." },
      { question: "What should I avoid sharing with Talia?", answer: "Do not share passwords, banking details, government identification numbers, medical information, or other sensitive personal information." },
    ],
  },
  {
    name: "Privacy",
    items: [
      { question: "Why does the website request consent?", answer: "Consent confirms that information may be used for the stated enquiry or recruitment purpose and relevant follow-up." },
      { question: "Where can submitted form data go?", answer: "When configured, valid submissions are forwarded server-side to Make.com for approved Google Sheets and recruiter-notification workflows." },
      { question: "Are Talia conversations stored?", answer: "No. Talia conversation state exists only in React memory during the current page session and is not sent to Make.com." },
      { question: "Does the website use analytics cookies?", answer: "No analytics are implemented. The local cookie-preference banner records only the visitor’s selected preference in browser storage." },
    ],
  },
];

export const faqItems = faqCategories.flatMap((category) => category.items);
