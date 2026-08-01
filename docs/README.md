# Talvanta Africa documentation

This directory is the home for approved product, content, brand, automation, AI-governance, and technical planning material. The canonical Markdown files should be imported from the approved Word planning documents and then reviewed for fidelity. Do not infer, reconstruct, or fill missing source material from assumptions.

## Intended structure

| File | Intended subject | Status |
| --- | --- | --- |
| `company-profile.md` | Approved company profile and business context | **Pending import from the approved source document** |
| `ai-agent.md` | Approved requirements, behaviour, safeguards, and escalation rules for Talia | **Pending import from the approved source document** |
| `website-blueprint.md` | Approved website structure, journeys, and functional blueprint | **Pending import from the approved source document** |
| `website-content.md` | Approved page copy and content requirements | **Pending import from the approved source document** |
| `brand-guidelines.md` | Approved identity, typography, colour, and brand-usage guidance | **Pending import from the approved source document** |
| `automation-plan.md` | Approved Make.com workflows, integrations, and data flows | **Pending import from the approved source document** |
| `technical-specification.md` | Approved architecture, data, security, testing, deployment, and implementation requirements | **Pending import from the approved source document** |

None of the seven source files currently exists in this repository. Their status must remain pending until the approved source content is supplied and imported. When importing, preserve meaning and approvals, identify any conversion uncertainty, and do not silently add unapproved requirements.

## Implementation notes

- Ticket 001 authorizes the July 2026 public-facing brand and homepage copy refinements implemented in the website. This ticket-specific authorization does not replace the pending approved company profile, website content, or brand-guideline source documents listed above.
- Ticket 002 authorizes the July 2026 Jobs experience, including its empty verified-vacancy state, human-led opportunity process, typed vacancy model, local filtering architecture, and future job-details route. The repository contains no vacancy records until genuine roles and publication details are verified.
- Ticket 003 authorizes the July 2026 About-page founder story and company-identity wording, including the founder name and role, mission, vision, values, and positioning statements. This ticket-specific authorization does not replace the pending approved company profile or brand-guideline source documents.
- Ticket 004 authorizes the July 2026 Contact-page pathways and public business-information wording, including the remote-first service model, service coverage, business hours, and response information. This ticket-specific authorization does not replace the pending approved company profile or website-content source documents.
- Ticket 005 authorizes the July 2026 candidate-registration journey, form guidance, candidate-specific confirmation and error experience, and display of the existing server-generated submission reference. It does not authorize changes to candidate payload fields, validation, consent, or external workflow mappings.
- Ticket 006 authorizes the July 2026 employer recruitment-request journey, employer-specific confirmation and error experience, and display of the existing server-generated submission reference. It does not authorize changes to employer payload fields, validation, consent, or external workflow mappings.
- Fix Ticket 006 establishes `/for-employers` as the canonical public employer route. The legacy `/employers` and `/hire-talent` pages permanently redirect to it, while the existing `/api/hire-talent` submission endpoint remains unchanged.
- Ticket 007A documents the existing server-generated acknowledgement-email mappings for candidate, employer, and contact submissions. Email delivery remains a manual Make.com responsibility; the website does not send acknowledgement emails directly.
- Ticket 008 authorizes the July 2026 Services-page information architecture and customer-facing descriptions of the platform’s supported employer, professional, technology-enabled administration, human-oversight, pathway, and service-limitation content.
- Ticket 009 authorizes the July 2026 Job Seeker Support page’s candidate journey, preparation, verified-opportunity, privacy, limitation, and frequently asked question content. It does not authorize changes to candidate registration, submission, or external workflow behaviour.
- Ticket 010 authorizes the July 2026 site-wide presentation and navigation refinement, including canonical navigation links, active-page indicators, mobile-menu accessibility, footer information architecture and wording, and shared visual consistency. It does not authorize changes to APIs, forms, payloads, integrations, workflow logic, vacancy data, or Talia response behaviour.
- Ticket 011 authorizes the July 2026 public project case study at `/project-case-study`, its truthful portfolio and technical content, its discreet footer link, and its sitemap entry. External Make.com, Google Sheets, Gmail, acknowledgement, and deployment claims remain qualified by their documented configuration and verification status.
- Ticket 012 authorizes the July 2026 Supabase SSR foundation: validated public configuration, browser and server client factories, cookie-session refresh through the Next.js Proxy convention, a server-only configuration check, and operational documentation. It does not authorize authentication UI, authorization rules, database tables, migrations, Storage buckets, CV uploads, dashboards, or changes to public form workflows.
- Ticket 013 authorizes candidate and employer email/password authentication, verification and recovery callbacks, safe redirects, sign-out, and the protected `/account` placeholder. See `authentication.md`. It does not authorize profile tables, role-backed RLS, dashboards, administrator access, Storage, or CV uploads.
- Ticket 014 authorizes typed access to the existing profile tables, database-role-aware account routing, candidate and employer onboarding/editing, calculated completion guidance, and RLS verification documentation. See `database-profiles-and-rls.md`. It does not authorize schema changes, CV upload, Storage, admin access, vacancy management, or public-workflow changes.
- Ticket 015 authorizes candidate-owned PDF CV upload, replacement, private signed download, deletion, metadata integration, and RLS testing guidance for the existing private `candidate-cvs` bucket. See `private-cv-storage.md`. It does not authorize schema changes, DOCX, scanning, parsing, AI analysis, or non-candidate access.
- Ticket 016 authorizes the candidate-only dashboard, canonical profile routes, account navigation, server-loaded summaries, completion guidance, CV status, recent account information, quick actions, and candidate settings foundation. See `candidate-dashboard.md`. It does not authorize applications, matching, scoring, ranking, alerts, employer access, or schema changes.
