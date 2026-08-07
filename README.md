# Talvanta Africa

Talvanta Africa is an AI-powered HR recruitment and talent-solutions project intended to connect qualified professionals with growing businesses across Nigeria and Africa.

> **Sprint 9 status:** The public contact centre, FAQ, privacy, terms, local preference banner, improved navigation/footer, and contact enquiry API are implemented. Talia remains a rule-based demonstration assistant. Employer, candidate, and contact submissions can be forwarded to separately configured Make.com webhooks.

## Capstone context

This repository supports the Talvanta Africa capstone project. The planned product combines a public company website, recruitment journeys for employers and candidates, and carefully governed AI assistance with human recruitment oversight.

## Planned user groups

- Employers seeking recruitment support
- Job seekers exploring career opportunities
- General visitors seeking company and service information
- Users interacting with Talia, the Talvanta Intelligent Assistant

## Planned features

Subject to the approved planning documents being imported, the project is expected to include:

- Company and recruitment-service information
- Employer enquiry and recruitment-lead journeys
- Job discovery and candidate application journeys
- General contact functionality
- Talia-assisted guidance, frequently asked questions, and navigation
- Server-side handoff of consented, validated information to Make.com workflows

These are planned capabilities, not currently implemented features.

## Technology stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Zod for planned server-side validation
- React Hook Form where appropriate
- Lucide React when icons are introduced
- Vercel for planned hosting
- Make.com for planned automation and OpenAI orchestration
- Google Sheets as the planned initial data store
- Git and GitHub for version control and collaboration

Not every planned dependency or integration is installed or configured during Sprint 2.

## Local development

Prerequisites: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. Other available checks and production commands are:

```bash
npm run lint
npm run build
npm run start
```

## Documentation

Repository documentation belongs in [`docs/`](docs/README.md). The approved planning documents still need to be imported; the documentation index identifies every pending source file. Missing documents must not be reconstructed from assumptions.

Ticket 20A's secure candidate application-submission workflow is documented in [`docs/job-application-submission.md`](docs/job-application-submission.md).

The public [`/project-case-study`](https://talvanta-africa.vercel.app/project-case-study) route presents the project’s architecture, implemented controls, responsible-technology approach, limitations, and possible roadmap without exposing credentials or duplicating the technical runbooks.

## Environment variables

Copy `.env.example` to `.env.local` and provide values only in the local file:

```bash
Copy-Item .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local`. Never commit secrets. Variables without the `NEXT_PUBLIC_` prefix must remain server-only; configure production values through Vercel’s protected environment settings.

Add the real employer, candidate, and contact Make.com webhook URLs to `.env.local`, optionally add a long shared secret, and restart the development server after changes. Never commit `.env.local`; rotate any webhook URL or secret that is exposed. See [`docs/make-integration.md`](docs/make-integration.md) and [`docs/contact-integration.md`](docs/contact-integration.md) for manual Make.com, Google Sheets, and recruiter-email configuration.

## Supabase foundation

Ticket 012 adds validated public Supabase configuration, browser and server SSR client factories, and cookie-session refresh plumbing for later authentication work. It does not add authentication pages, database tables, dashboards, Storage buckets, or CV uploads. See [`docs/supabase-foundation.md`](docs/supabase-foundation.md) for setup, boundaries, limitations, and production guidance.

## Authentication

Ticket 013 adds candidate and employer email/password signup, verification, sign-in, recovery, sign-out, safe callback redirects, and a protected account placeholder. It does not add profile tables, dashboards, administrator access, Storage, or CV upload. See [`docs/authentication.md`](docs/authentication.md) for configuration, security boundaries, testing, and limitations.

## Database profiles

Ticket 014 connects authenticated candidate and employer accounts to the existing RLS-protected profile tables, adds role-aware onboarding and editing, and calculates transparent profile-completion guidance. It does not create database schema, dashboards, administrator access, Storage, or CV upload. See [`docs/database-profiles-and-rls.md`](docs/database-profiles-and-rls.md).

## Private CV storage

Ticket 015 adds candidate-owned PDF CV upload, replacement, private download, deletion, and document metadata using the existing private Supabase bucket and RLS policies. PDF signature and size checks are included; malware scanning, parsing, DOCX support, and employer access are not. See [`docs/private-cv-storage.md`](docs/private-cv-storage.md).

## Candidate dashboard

Ticket 016 adds a candidate-only dashboard, canonical profile and edit routes, CV and account summaries, career-preference guidance, quick actions, and a limited settings foundation. It does not add applications, matching, scoring, rankings, job alerts, or employer access. See [`docs/candidate-dashboard.md`](docs/candidate-dashboard.md).

## Employer dashboard

Ticket 017 adds an employer-only dashboard, canonical organisation-profile routes, and an authenticated Supabase recruitment-request lifecycle covering drafts, submission, clarification editing, withdrawal, and draft deletion. It remains separate from the existing public Make.com workflow and adds no staff review or vacancy publishing. See [`docs/employer-dashboard-and-requests.md`](docs/employer-dashboard-and-requests.md).

## AI and human oversight

Talia is planned as an AI recruitment assistant. It must disclose that it is AI, collect lead information only with consent, and support rather than replace human recruitment judgement. It must not guarantee employment or placement, automatically reject candidates, make final hiring decisions, request unnecessary sensitive information, or produce discriminatory recommendations.

## Demonstration data

All sample jobs, candidates, employers, testimonials, metrics, and other fictional content must be clearly labelled as demonstration data. Demonstration content must never be presented as real, and real personal data must not be used in examples or tests.

## Current limitations

- The Jobs route remains a branded placeholder; a job board is outside Sprint 9.
- Talia uses deterministic mock responses rather than live generative AI. Conversation state exists only in browser memory and is cleared by a refresh or page close.
- Webhook forwarding requires local or deployment configuration, and the repository does not automatically create Make.com scenarios, Sheets, or email connections.
- Approved Word planning documents are not yet available in this repository.
- Planned libraries beyond the generated starter dependencies have not been installed.

See [`docs/talia-mock-mode.md`](docs/talia-mock-mode.md) for Talia’s architecture, privacy limitations, responsible-recruitment boundaries, testing guidance, and future upgrade path.

The next project-level step remains importing and reviewing the approved source documents, obtaining qualified review of the privacy and terms drafts, and configuring/testing the three external workflows before production use.

## SEO and deployment readiness

Sprint 10 adds canonical and social metadata, structured data, `robots.txt`,
`sitemap.xml`, compatible security headers, and a shared public-site URL
configuration. Set `NEXT_PUBLIC_SITE_URL` to the approved HTTPS production
origin before deployment. See
[`docs/production-readiness.md`](docs/production-readiness.md) for the complete
pre-deployment, post-deployment, external-workflow, and rollback checklist.
Use [`docs/vercel-deployment.md`](docs/vercel-deployment.md) for the controlled
manual Vercel import, temporary `vercel.app` URL, environment configuration,
production form testing, custom-domain, Git release, and recovery procedures.
