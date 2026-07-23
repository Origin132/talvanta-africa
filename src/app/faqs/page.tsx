import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Talvanta Africa, recruitment services, employer and candidate journeys, Talia, and privacy.",
};

const categories = [
  {
    name: "General",
    items: [
      ["What is Talvanta Africa?", "Talvanta Africa is an AI-powered HR recruitment and talent-solutions company connecting qualified professionals with growing businesses across Nigeria and Africa."],
      ["Who can use this website?", "Employers, job seekers, and visitors seeking information about Talvanta Africa’s recruitment services can use the public website."],
      ["How can I contact the team?", "Use the contact form for general, partnership, privacy, or website enquiries. Employers and candidates should use their dedicated forms where appropriate."],
      ["Are all website services live?", "This website is a demonstration project. Features and placeholder content are identified, and external workflows operate only when separately configured."],
    ],
  },
  {
    name: "Employers",
    items: [
      ["How do I request recruitment support?", "Complete the Hire Talent form with organisation, role, requirements, and consent information for review."],
      ["Does submitting a hiring enquiry create a service agreement?", "No. A submission does not create a service agreement or guarantee candidate availability or recruitment success."],
      ["Which recruitment services are available?", "Services presented on the website include Permanent Recruitment, Temporary and Contract Staffing, Executive Search, Graduate Recruitment, Candidate Screening, and HR Advisory."],
      ["Who makes the final hiring decision?", "Employers and authorised people make hiring decisions. Technology and Talia do not make final recruitment decisions."],
    ],
  },
  {
    name: "Job Seekers",
    items: [
      ["How do I register as a candidate?", "Use the Candidate Registration form to provide your professional background, skills, experience, preferences, and required acknowledgements."],
      ["Does registration guarantee a job?", "No. Registration does not guarantee contact, shortlisting, an interview, placement, or employment."],
      ["Can I upload a CV?", "No. File uploads and CV analysis are not available in the current website version."],
      ["Will Talia assess my suitability?", "No. Talia does not score, rank, shortlist, or reject candidates."],
    ],
  },
  {
    name: "Recruitment",
    items: [
      ["How does the recruitment process begin?", "An employer submits role information or a candidate registers professional information. Relevant information may then be reviewed by people within the configured recruitment workflow."],
      ["What is Permanent Recruitment?", "It supports organisations seeking employees for ongoing roles through role clarification, candidate identification, screening support, and human-led recruitment."],
      ["What is Executive Search?", "It supports senior, specialist, or leadership recruitment through targeted identification, structured assessment, and human-led engagement."],
      ["Does candidate screening mean automatic rejection?", "No. Candidate screening supports review against role requirements; final decisions remain human-led."],
    ],
  },
  {
    name: "AI Assistant",
    items: [
      ["What is Talia?", "Talia is currently a rule-based automated website assistant that provides approved recruitment information and navigation guidance."],
      ["Is Talia a human recruiter?", "No. Talia is not human and does not claim to be a recruiter or hiring manager."],
      ["Does Talia use live generative AI?", "No. The current demonstration selects deterministic approved responses and does not call an external AI service."],
      ["What should I avoid sharing with Talia?", "Do not share passwords, banking details, government identification numbers, medical information, or other sensitive personal information."],
    ],
  },
  {
    name: "Privacy",
    items: [
      ["Why does the website request consent?", "Consent confirms that information may be used for the stated enquiry or recruitment purpose and relevant follow-up."],
      ["Where can submitted form data go?", "When configured, valid submissions are forwarded server-side to Make.com for approved Google Sheets and recruiter-notification workflows."],
      ["Are Talia conversations stored?", "No. Talia conversation state exists only in React memory during the current page session and is not sent to Make.com."],
      ["Does the website use analytics cookies?", "No analytics are implemented. The local cookie-preference banner records only the visitor’s selected preference in browser storage."],
    ],
  },
] as const;

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Frequently asked questions"
        supportingText="Clear answers about Talvanta Africa’s services, recruitment journeys, automated assistant, and information handling."
        primaryAction={{ label: "Contact the team", href: "/contact" }}
        variation="dark"
      />
      <PageContainer className="py-16 sm:py-24">
        <div className="space-y-14">
          {categories.map((category) => (
            <section key={category.name} aria-labelledby={`faq-${category.name.toLowerCase().replaceAll(" ", "-")}`}>
              <h2 id={`faq-${category.name.toLowerCase().replaceAll(" ", "-")}`} className="text-3xl font-extrabold text-navy">
                {category.name}
              </h2>
              <div className="mt-6 divide-y divide-border-grey border-y border-border-grey">
                {category.items.map(([question, answer]) => (
                  <details key={question} className="group py-2">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-heading font-extrabold text-navy">
                      {question}
                      <span aria-hidden="true" className="text-2xl text-green group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-3xl pb-5 leading-7 text-slate">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PageContainer>
      <CTASection
        heading="Still need help?"
        supportingText="Send a general enquiry or choose a dedicated recruitment form."
        primaryAction={{ label: "Contact Talvanta Africa", href: "/contact" }}
        secondaryAction={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}
