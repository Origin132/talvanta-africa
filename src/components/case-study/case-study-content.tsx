import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { SectionHeading } from "@/components/ui/section-heading";

type Card = { title: string; text: string; items?: readonly string[] };
type FlowStep = { title: string; text?: string };

const objectives: readonly Card[] = [
  { title: "Professional User Experience", text: "Build a responsive, accessible recruitment website for employers and professionals." },
  { title: "Structured Data Collection", text: "Collect employer, candidate, and general-enquiry information through clearly organised forms." },
  { title: "Secure Server Processing", text: "Validate submissions through internal server routes without exposing private webhook URLs to the browser." },
  { title: "Workflow Automation", text: "Forward valid submissions to separately configured Make.com scenarios for structured administration." },
  { title: "Human-Led Recruitment", text: "Support administration and communication without automating consequential recruitment decisions." },
  { title: "Production Deployment", text: "Deliver a production-buildable Next.js application with GitHub source control and a documented Vercel deployment path." },
];

const journeys: readonly Card[] = [
  { title: "Employers", text: "Review services and submit a structured recruitment request. The website validates the request, returns controlled feedback, and can forward it to Make.com. Sheet records, internal notifications, and acknowledgements depend on an active, tested scenario." },
  { title: "Professionals", text: "Review candidate support, explore the verified-opportunity state, and register a professional profile. Registration enters the configured candidate workflow but does not guarantee consideration or employment." },
  { title: "General Enquiries", text: "Use the Contact page to create a structured enquiry. When its external workflow is configured, Make.com can create a Contact Enquiries record and send notifications or acknowledgements." },
];

const architecture: readonly FlowStep[] = [
  { title: "Website Visitor", text: "Uses an employer, candidate, Contact, or Talia interface." },
  { title: "Next.js User Interface", text: "Provides responsive forms, client guidance, loading states, and accessible feedback." },
  { title: "Server-Side API Route", text: "Receives requests so private webhook URLs are not exposed to browser code." },
  { title: "Validation and Security Controls", text: "Checks origin, content type, body size, allowed fields, consent, honeypots, and process-local rate limits as applicable." },
  { title: "Make.com Webhook", text: "Receives a validated, structured payload when the relevant private webhook is configured." },
  { title: "Google Sheets Record", text: "A configured Make.com scenario can add the mapped administrative record." },
  { title: "Gmail Notification", text: "A configured and authorised scenario can send internal or acknowledgement email." },
  { title: "Controlled Website Response", text: "Returns safe success or error information without exposing upstream response bodies or workflow details." },
];

const technologies: readonly Card[] = [
  { title: "Frontend", text: "Application interface", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"] },
  { title: "Backend and Application Logic", text: "Server-rendered application boundaries", items: ["Next.js App Router", "Route Handlers", "Custom server-side validation", "Node.js-compatible runtime"] },
  { title: "Automation", text: "Repository forwarding layer and external workflow design", items: ["Make.com custom webhooks", "Typed versioned webhook payloads"] },
  { title: "Data and Communication", text: "Conditional external scenario destinations", items: ["Google Sheets", "Gmail"] },
  { title: "Development and Deployment", text: "Source control and hosting", items: ["Git", "GitHub", "Codex", "Vercel"] },
  { title: "Assistant", text: "No paid generative-AI processing is currently used", items: ["Talia rule-based assistant", "Stable internal JSON API contract"] },
];

const workflows = [
  { title: "Employer workflow", steps: ["Employer Form", "Server Validation", "Make.com", "Employer Enquiries Sheet", "Recruiter Notification", "Acknowledgement Email — optional and requires configuration"] },
  { title: "Candidate workflow", steps: ["Candidate Registration", "Server Validation", "Make.com", "Candidate Registrations Sheet", "Recruiter Notification", "Acknowledgement Email — optional and requires configuration"] },
  { title: "Contact workflow", steps: ["Contact Form", "Server Validation", "Make.com", "Contact Enquiries Sheet", "Recruiter Notification", "Acknowledgement Email — optional and requires configuration"] },
] as const;

const security = [
  "Private webhook URLs and an optional shared secret are read only by server-side code.",
  "Form routes enforce JSON content types, 64 KB request limits, allow-listed fields, server validation, and required consent.",
  "Same-origin checks, hidden honeypot fields, and hashed process-local rate-limit identifiers reduce common misuse.",
  "Webhook timeouts, upstream failures, missing configuration, and unexpected errors produce controlled responses.",
  "Operational logs contain categories and random correlation identifiers rather than form bodies or personal data.",
  "Talia keeps up to 16 messages in browser memory, sends them only to /api/talia, and creates no Make.com, Sheet, Gmail, or database record.",
  ".env.local is ignored by Git; real credentials must remain in local or protected deployment configuration.",
] as const;

const challenges: readonly Card[] = [
  { title: "Protecting Webhook URLs", text: "Browser forms call internal Next.js routes. Only validated payloads are forwarded to private environment-configured webhook URLs." },
  { title: "Maintaining Clear User Pathways", text: "Employer, candidate, Jobs, Contact, and service pages lead visitors towards distinct, canonical actions." },
  { title: "Making Early-Stage Scope Credible", text: "Truthful operational wording, vacancy empty states, human-review disclaimers, and this separate case study clarify what exists." },
  { title: "Automating Without an Application Database", text: "The forwarding contract supports Make.com, Sheets, and Gmail as a practical early-stage workflow, while external resources remain separately configured." },
  { title: "Adding an Assistant Without Paid AI", text: "Talia uses deterministic approved responses behind a stable API contract that can support a separately reviewed future upgrade." },
  { title: "Route Consistency", text: "Canonical routes, legacy redirects, and codebase-wide internal-link reviews reduce broken paths and duplication." },
];

const limitations = [
  "The platform uses a vercel.app address rather than a custom domain.",
  "There is no live vacancy-management database, and no verified vacancy records are currently published.",
  "There are no employer or candidate accounts, secure authentication, admin dashboard, or application-tracking system.",
  "There is no CV upload or document-storage infrastructure; candidate registration accepts a text CV summary only.",
  "There is no production generative-AI integration or automated candidate ranking, shortlisting, rejection, or hiring.",
  "The project makes no claim of completed placements, customers, revenue, or recruitment outcomes.",
  "Rate limiting is process-local, resets on restart, and is not shared across serverless instances.",
  "Make.com, Google Sheets, Gmail, and acknowledgement delivery require separately active, connected, authorised, and tested scenarios.",
] as const;

const roadmap: readonly Card[] = [
  { title: "Phase 1 — Operational Foundation", text: "Establish verified operational channels.", items: ["Custom domain", "Business email", "Verified contact channels", "Genuine vacancy publication"] },
  { title: "Phase 2 — Database and Administration", text: "Introduce controlled operational records.", items: ["PostgreSQL or Supabase", "Secure admin authentication", "Vacancy management", "Employer and candidate record management"] },
  { title: "Phase 3 — User Accounts", text: "Explore secure candidate and employer self-service.", items: ["Authentication", "Profile updates", "Application history", "Employer vacancy management"] },
  { title: "Phase 4 — Secure Documents", text: "Design a reviewed document-handling lifecycle.", items: ["CV upload", "File validation", "Access permissions", "Retention and deletion rules"] },
  { title: "Phase 5 — Responsible AI Upgrade", text: "Consider assistive AI only with governance and human review.", items: ["Controlled AI integration", "Approved knowledge base", "Recruiter summaries", "Human-reviewed job descriptions", "Assistive recommendations", "Audit and bias safeguards"] },
];

function Section({ eyebrow, heading, children, muted = false, id }: { eyebrow: string; heading: string; children: React.ReactNode; muted?: boolean; id?: string }) {
  return <section id={id} className={`${muted ? "bg-soft-grey" : "bg-white"} ${id ? "scroll-mt-24" : ""}`}><PageContainer className="py-16 sm:py-24"><SectionHeading eyebrow={eyebrow} heading={heading} /><div className="mt-10">{children}</div></PageContainer></section>;
}

function CardGrid({ cards, columns = "lg:grid-cols-3" }: { cards: readonly Card[]; columns?: string }) {
  return <div className={`grid gap-5 sm:grid-cols-2 ${columns}`}>{cards.map((card) => <article key={card.title} className="flex min-w-0 flex-col rounded-[var(--radius)] border border-border-grey bg-white p-6"><h3 className="text-xl font-extrabold text-navy">{card.title}</h3><p className="mt-3 leading-7 text-slate">{card.text}</p>{card.items ? <ul className="mt-5 list-disc space-y-2 pl-5 text-slate">{card.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</article>)}</div>;
}

function Flow({ steps, label }: { steps: readonly (FlowStep | string)[]; label: string }) {
  return <ol aria-label={label} className="grid gap-3 md:grid-cols-2">{steps.map((step, index) => { const title = typeof step === "string" ? step : step.title; const text = typeof step === "string" ? undefined : step.text; return <li key={title} className="relative min-w-0 rounded-[var(--radius)] border border-border-grey bg-white p-5 pl-16"><span className="absolute left-5 top-5 grid size-8 place-items-center rounded-full bg-navy text-sm font-extrabold text-white" aria-hidden="true">{index + 1}</span><p className="font-heading font-extrabold text-navy">{title}</p>{text ? <p className="mt-2 text-sm leading-6 text-slate">{text}</p> : null}</li>; })}</ol>;
}

export function CaseStudyContent() {
  return <>
    <section className="bg-navy text-white"><PageContainer className="py-16 sm:py-20 lg:py-24"><div className="max-w-4xl"><p className="text-sm font-extrabold uppercase tracking-[0.16em] text-gold">Project Case Study</p><h1 className="mt-4 max-w-[20ch] text-balance text-[2.125rem] font-extrabold leading-[1.12] tracking-tight min-[360px]:text-4xl sm:text-5xl lg:text-6xl">Building Talvanta Africa: a full-stack recruitment technology platform</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/85 sm:text-xl">Talvanta Africa began as a capstone project focused on demonstrating how modern web development, workflow automation, structured data collection, and responsible technology can support clearer recruitment journeys for employers and professionals.</p><p className="mt-6 inline-flex rounded-full border border-gold px-4 py-2 text-sm font-bold text-white"><span className="mr-2 text-gold">Current status:</span> Live early-stage platform and portfolio project</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/" variant="secondary">Visit the Live Platform</ButtonLink><ButtonLink href="#technical-architecture" variant="light">View the Technical Architecture</ButtonLink></div></div></PageContainer></section>

    <Section eyebrow="Overview" heading="From capstone concept to deployed web application"><div className="max-w-4xl space-y-5 text-lg leading-8 text-slate"><p>Talvanta Africa was developed to explore how a recruitment platform could bring employer enquiries, candidate registration, general contact requests, automated communication, and responsible digital guidance into one structured web experience.</p><p>The capstone evolved into a publicly deployed, early-stage application with working website forms, server-side routes, a Make.com forwarding layer, SEO infrastructure, and a rule-based recruitment assistant. Google Sheets records, Gmail notifications, and acknowledgements are documented external workflow steps that require separate configuration and testing.</p><p className="font-semibold text-navy">The platform does not claim established recruitment outcomes, active customers, or completed placements.</p></div></Section>

    <Section eyebrow="The Problem" heading="Recruitment information is often fragmented and difficult to manage" muted><p className="max-w-4xl leading-8 text-slate">The project treats unclear employer requirements, inconsistent candidate information, mixed enquiry channels, slow manual administration, uncertain user pathways, overstated AI claims, and the need for human-led decisions as design problems—not findings from a formal market study.</p></Section>

    <Section eyebrow="Objectives" heading="What the platform was designed to demonstrate"><CardGrid cards={objectives} /></Section>
    <Section eyebrow="User Journeys" heading="Three clear pathways through the platform" muted><CardGrid cards={journeys} /></Section>

    <Section id="technical-architecture" eyebrow="Technical Architecture" heading="How the platform processes a submission"><Flow steps={architecture} label="Submission-processing architecture" /><p className="mt-6 max-w-4xl rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5 leading-7 text-slate">The repository controls processing through the Make.com webhook response. Downstream Sheets and Gmail steps operate only when the relevant external scenario is active, connected, authorised, and mapped correctly.</p></Section>

    <Section eyebrow="Technology Stack" heading="Tools used to design, build, automate, and deploy the platform" muted><CardGrid cards={technologies} /></Section>

    <Section eyebrow="Workflow Automation" heading="Turning website submissions into organised administrative records"><div className="space-y-8">{workflows.map((workflow) => <article key={workflow.title}><h3 className="mb-4 text-xl font-extrabold text-navy">{workflow.title}</h3><Flow steps={workflow.steps} label={workflow.title} /></article>)}</div><p className="mt-8 font-semibold leading-7 text-navy">Make.com scenarios must remain active, connected, authorised, and tested for the external workflow to operate.</p></Section>

    <Section eyebrow="Digital Assistant" heading="Talia provides structured guidance without making recruitment decisions" muted><div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]"><div className="space-y-4 leading-8 text-slate"><p>Talia is Talvanta Africa’s digital website assistant. The current version sends questions to an internal API route and selects rule-based, approved responses.</p><p>It guides visitors to relevant pages, answers supported questions, discourages sensitive-information sharing, and does not score, rank, shortlist, reject, or hire candidates. It does not guarantee employment and does not use paid generative-AI processing.</p></div><Flow label="Talia interaction flow" steps={["Visitor Question", "Internal /api/talia Route", "Rule-Based Matching", "Approved Response", "Relevant Internal Link"]} /></div></Section>

    <Section eyebrow="Security and Privacy" heading="Protecting the workflow through controlled server-side processing"><ul className="grid gap-4 md:grid-cols-2">{security.map((item) => <li key={item} className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-5 leading-7 text-slate">{item}</li>)}</ul><p className="mt-6 max-w-4xl text-sm leading-6 text-slate">These controls reduce risk but do not constitute penetration testing, formal certification, complete abuse prevention, or distributed production-grade rate limiting.</p></Section>

    <Section eyebrow="Accessibility and Responsiveness" heading="Designed for different devices and interaction needs" muted><p className="max-w-4xl leading-8 text-slate">The project uses responsive layouts, semantic headings and landmarks, labelled controls, keyboard-operable navigation, visible focus states, accessible status feedback, touch-friendly actions, responsive card grids, readable legal pages, a viewport-constrained Talia panel, and branded loading, not-found, and error experiences.</p><p className="mt-4 max-w-4xl font-semibold leading-7 text-navy">It was developed with accessibility-oriented practices and tested across representative viewport sizes; this is not a claim of formal WCAG certification.</p></Section>

    <Section eyebrow="SEO and Deployment" heading="Prepared for public discovery and production hosting"><div className="grid gap-8 lg:grid-cols-2"><ul className="list-disc space-y-3 pl-5 leading-7 text-slate"><li>Page-specific titles, descriptions, canonical URLs, and Open Graph metadata</li><li>Robots and sitemap metadata routes</li><li>Organisation, website, service, and FAQ structured data where applicable</li><li>Next.js production builds and security response headers</li><li>Git source control and a GitHub remote</li><li>Protected environment-variable design and a documented Vercel deployment process</li><li>HTTPS provided by the current Vercel-hosted address</li></ul><div className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6"><h3 className="text-xl font-extrabold text-navy">Public deployment</h3><p className="mt-3 leading-7 text-slate">The ticket identifies the current Vercel-hosted platform at <Link className="break-all font-bold text-green underline underline-offset-4" href="https://talvanta-africa.vercel.app">talvanta-africa.vercel.app</Link>. No custom domain, search-engine indexing result, ranking, or independently verified production-form result is claimed.</p></div></div></Section>

    <Section eyebrow="Developer Contribution" heading="Designed and developed by Bashir" muted><div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><div><p className="font-heading text-xl font-extrabold text-green">AI-Powered Full-Stack Web Application Developer</p><p className="mt-4 leading-8 text-slate">Bashir designed, developed, tested, automated, and deployed Talvanta Africa as an end-to-end recruitment technology project. His contribution covered product planning, user journeys, responsive interface development, server-side API design, validation, workflow automation design, Google Sheets and email workflow mapping, responsible digital-assistant design, SEO preparation, Git version control, and Vercel deployment.</p></div><ul className="grid gap-2 text-sm text-slate sm:grid-cols-2 lg:grid-cols-1">{["Product and workflow planning", "Next.js, React, and TypeScript", "Responsive UI development", "Server-side routes", "Validation and error handling", "Make.com automation", "Google Sheets integration mapping", "Gmail workflow configuration", "Responsible AI design", "Git, GitHub, and Vercel"].map((skill) => <li key={skill} className="rounded-lg border border-border-grey bg-white px-4 py-3 font-semibold">{skill}</li>)}</ul></div></Section>

    <Section eyebrow="Challenges and Solutions" heading="Key implementation challenges"><CardGrid cards={challenges} /></Section>
    <Section eyebrow="Current Limitations" heading="What the platform does not yet include" muted><ul className="grid gap-4 md:grid-cols-2">{limitations.map((item) => <li key={item} className="rounded-[var(--radius)] border border-border-grey bg-white p-5 leading-7 text-slate">{item}</li>)}</ul></Section>
    <Section eyebrow="Future Roadmap" heading="Potential next stages of development"><p className="mb-8 max-w-3xl leading-7 text-slate">These are possible future phases, not current features or commitments.</p><CardGrid cards={roadmap} columns="lg:grid-cols-2" /></Section>

    <Section eyebrow="Learning Outcomes" heading="What the project demonstrates" muted><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["Turning a business idea into a deployed application", "Planning distinct user journeys", "Building reusable React and Next.js components", "Creating responsive layouts", "Designing server-side routes and validation", "Managing environment variables", "Integrating external automation boundaries", "Mapping structured Google Sheets data", "Designing email workflows", "Protecting private webhook endpoints", "Designing responsible recruitment technology", "Managing Git, builds, routes, hydration, and deployment configuration"].map((item) => <li key={item} className="rounded-[var(--radius)] border border-border-grey bg-white p-5 font-semibold leading-7 text-navy">{item}</li>)}</ul></Section>

    <CTASection heading="Explore the platform or discuss a similar solution" supportingText="Review the live Talvanta Africa experience, explore the recruitment journeys, or use the Contact page to discuss the platform and its workflow-automation approach." primaryAction={{ label: "Explore Talvanta Africa", href: "/" }} secondaryAction={{ label: "Contact Talvanta Africa", href: "/contact" }} />
  </>;
}
