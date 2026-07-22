<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Talvanta Africa project instructions

## Project context

Talvanta Africa is an AI-powered HR recruitment and talent-solutions company connecting qualified professionals with growing businesses across Nigeria and Africa. The planned platform will serve employers, job seekers, general visitors, and users of Talia, the Talvanta Intelligent Assistant. The approved tagline is: “Connecting exceptional talent with growing businesses.”

This repository is currently in Sprint 0. Do not begin application UI or feature development unless a future task explicitly authorizes it.

## Required documentation

Treat the approved planning documents as the source of truth. Their future repository locations are listed in `docs/README.md`. If an approved source document has not been imported, mark the documentation as pending and ask for the source; do not invent, reconstruct, or present assumed content as approved.

Before implementing related work, read the relevant project documentation in `docs/` and the relevant installed Next.js guide in `node_modules/next/dist/docs/`. Record material decisions or changes in the appropriate project documentation.

## Technology requirements

- Use the Next.js App Router, TypeScript, and Tailwind CSS.
- Target deployment on Vercel.
- Use Make.com for planned automation and OpenAI integration; do not expose OpenAI credentials or call OpenAI directly from browser code.
- Use Google Sheets as the planned initial data store only where approved documentation permits it.
- Use Zod for server-side validation, React Hook Form where it adds value, and Lucide React when icons are introduced.
- Do not add or replace dependencies without explicit approval. Use the existing package manager and lockfile.

## Coding standards

- Keep TypeScript strict and avoid `any`; model data and boundaries with explicit types.
- Prefer Server Components. Add Client Components only where browser APIs, state, or interactivity require them, and keep the client boundary small.
- Favor small, focused, reusable modules with clear names and minimal duplication.
- Follow the repository’s existing conventions and use the `@/*` import alias for source imports where appropriate.
- Do not suppress lint or type errors without documenting a specific justification.
- Keep framework-specific implementation consistent with the installed Next.js documentation and heed its deprecation notices.

## Accessibility

- Target WCAG 2.2 AA and use semantic HTML before ARIA.
- Ensure full keyboard access, visible focus states, logical heading order, labelled controls, descriptive link text, and useful alternative text.
- Maintain sufficient colour contrast and do not convey meaning through colour alone.
- Respect reduced-motion preferences and provide accessible validation and status feedback.

## Responsive design

- Build mobile-first and support small phones through large desktop screens without horizontal overflow.
- Use fluid layouts and content-driven breakpoints rather than device-specific assumptions.
- Keep touch targets usable and verify navigation, forms, tables, and long content at representative viewport sizes.

## Content rules

- Use clear, professional, inclusive English appropriate for audiences across Nigeria and Africa.
- Do not make unsupported claims, employment guarantees, placement guarantees, or claims that AI replaces professional recruitment judgement.
- Preserve approved company facts and wording. Flag missing or uncertain content instead of inventing it.
- Obtain explicit consent before collecting or sending recruitment lead information.

## Brand rules

- Company name: Talvanta Africa.
- Tagline: Connecting exceptional talent with growing businesses.
- Use Manrope for headings and Inter for body text when branding is implemented.
- Approved colours: Talvanta Navy `#102A43`, Talvanta Green `#15803D`, Talvanta Gold `#D6A84B`, Talvanta Soft Grey `#F5F7FA`, Talvanta Slate `#243B53`, White `#FFFFFF`, Light Border Grey `#D9E2EC`, and Error Red `#DC2626`.
- Do not introduce unapproved logos, colour values, typography, or brand claims. Use the future brand guidelines as the final authority after import.

## Security

- Treat all client input and webhook responses as untrusted.
- Keep secrets and private endpoints server-side; never expose them through `NEXT_PUBLIC_` variables, client bundles, logs, errors, or repository files.
- Apply least privilege, minimize data collection, validate and sanitize at trust boundaries, and avoid logging personal or sensitive data.
- Add appropriate authorization, abuse protection, rate limiting, and safe error handling to future server endpoints.
- Do not request or retain unnecessary sensitive or special-category personal information.

## Environment variables

- Keep real values in ignored local environment files or the deployment platform’s protected configuration.
- Keep `.env.example` limited to variable names with blank, non-secret values.
- Only variables intentionally safe for browser exposure may use the `NEXT_PUBLIC_` prefix.
- Document any new variable in `.env.example` and the relevant technical documentation without including a real value.

## Form validation

- Validate every server-side submission with Zod even when client-side validation is present.
- Use React Hook Form where appropriate for accessible form state and validation feedback.
- Normalize and constrain inputs, reject unexpected fields where practical, and return safe field-level errors without leaking internals.
- Require and record meaningful consent before sending recruitment or contact data to Make.com.

## Talia restrictions

Talia must identify itself as an AI assistant and support, never replace, human recruitment judgement. It may guide employers and candidates, answer common questions, collect consented recruitment leads, help navigation, and send structured information through future server-side routes to Make.com.

Talia must never:

- pretend to be human;
- guarantee employment, placement, candidate quality, or hiring outcomes;
- automatically reject candidates or make final hiring decisions;
- request unnecessary sensitive information; or
- produce discriminatory recommendations or use protected characteristics as decision criteria.

Escalate consequential, ambiguous, sensitive, or exceptional recruitment matters to a qualified human.

## Demonstration data

- Clearly label all fictional, sample, seeded, placeholder, and demonstration content as such wherever a user could mistake it for real information.
- Never present demonstration jobs, candidates, employers, testimonials, metrics, or AI outputs as genuine.
- Do not use real personal data in fixtures, screenshots, tests, or demonstrations.

## Testing requirements

- For every change, run the most relevant available checks; at minimum run `npm run lint` and `npm run build` before handoff unless the task explicitly scopes them out.
- Add proportionate tests for future business logic, validation, routes, forms, accessibility-critical interactions, and error states when a test framework is available or authorized.
- Verify responsive and keyboard behaviour for UI changes and document any check that could not be run.
- Do not claim a check passed unless it was actually run successfully.

## Working method for future Codex tasks

1. Inspect the repository state and read `AGENTS.md`, `CLAUDE.md`, relevant files in `docs/`, and applicable installed Next.js guides before editing.
2. Preserve user changes and keep work strictly within the requested scope. Do not modify unrelated files.
3. State the planned approach and intended files before making material changes.
4. Make the smallest coherent change, using existing patterns and dependencies.
5. Never invent missing approved documentation, content, credentials, integrations, or business rules; surface gaps explicitly.
6. Review the diff, run relevant checks, and report files changed, validation results, limitations, assumptions, and the next recommended action.
7. Do not commit, push, deploy, contact external services, or make irreversible changes unless explicitly authorized.
