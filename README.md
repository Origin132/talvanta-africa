# Talvanta Africa

Talvanta Africa is an AI-powered HR recruitment and talent-solutions project intended to connect qualified professionals with growing businesses across Nigeria and Africa.

> **Sprint 6 status:** The shared foundation and core informational pages are in place. The employer hiring-request and candidate-registration forms submit to internal Next.js route handlers for server validation; no external processing or permanent storage is active.

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

## Environment variables

Copy `.env.example` to `.env.local` and provide values only in the local file:

```bash
Copy-Item .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local`. Never commit secrets. Variables without the `NEXT_PUBLIC_` prefix must remain server-only; configure production values through Vercel’s protected environment settings.

## AI and human oversight

Talia is planned as an AI recruitment assistant. It must disclose that it is AI, collect lead information only with consent, and support rather than replace human recruitment judgement. It must not guarantee employment or placement, automatically reject candidates, make final hiring decisions, request unnecessary sensitive information, or produce discriminatory recommendations.

## Demonstration data

All sample jobs, candidates, employers, testimonials, metrics, and other fictional content must be clearly labelled as demonstration data. Demonstration content must never be presented as real, and real personal data must not be used in examples or tests.

## Current limitations

- The homepage, About, Services, Employers, Job Seekers, Hire Talent, and Candidate Registration pages are developed; detailed content for the other public routes has not been developed.
- Remaining public routes are branded placeholders.
- Talia, external form processing, webhooks, storage, and external integrations are not implemented. Sprint 6 APIs validate requests internally and discard submitted data after responding.
- Approved Word planning documents are not yet available in this repository.
- Planned libraries beyond the generated starter dependencies have not been installed.

The next step is to import the approved source documents into `docs/`, review them, and use the approved content to guide the next page-development sprint.
