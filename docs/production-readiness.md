# Sprint 10 production-readiness guide

This guide covers repository readiness checks. It does not deploy the website,
create a domain, activate external resources, or certify legal, privacy,
security, accessibility, or performance compliance.

## Environment variables

Copy `.env.example` to an ignored `.env.local` for local development. Configure
deployment values in the hosting platform:

- `NEXT_PUBLIC_SITE_URL`: the final public HTTPS origin, with no path or trailing
  slash, for example `https://www.example.com`. Replace the local placeholder;
  do not invent or deploy an unapproved Talvanta Africa domain.
- `MAKE_EMPLOYER_WEBHOOK_URL`, `MAKE_CANDIDATE_WEBHOOK_URL`, and
  `MAKE_CONTACT_WEBHOOK_URL`: three server-side Make.com custom webhook URLs.
- `MAKE_WEBHOOK_TIMEOUT_MS`: a tested integer from 100 to 30000 milliseconds.
- `MAKE_WEBHOOK_SHARED_SECRET`: an optional long server-side secret also
  verified by each Make scenario.

The reserved chat and job-application variables are not active integrations.
OpenAI configuration is not required while Talia remains in deterministic mock
mode. Never use `NEXT_PUBLIC_` for a secret. `.env.local` is excluded by
`.gitignore`.

The metadata utility permits `http://localhost:3000` outside a Vercel production
deployment so local builds and development remain usable. On the first Vercel
deployment, the trusted generated HTTPS deployment URL may bootstrap metadata.
Set `NEXT_PUBLIC_SITE_URL` to the stable production origin and redeploy
immediately afterwards. A Vercel production deployment fails metadata generation
when neither a valid configured URL nor a trusted Vercel URL is available.
Equivalent validation must be included in any non-Vercel deployment process.

The full manual launch sequence, production form checklist, custom-domain
procedure, Git workflow, and rollback guide are in
[`vercel-deployment.md`](vercel-deployment.md).

## SEO and structured data

- Sitemap: `/sitemap.xml`
- Robots policy: `/robots.txt`
- Organization and WebSite JSON-LD: global layout
- Service JSON-LD: `/services`
- FAQPage JSON-LD: `/faqs`

Before launch, inspect canonical and Open Graph URLs using the final domain.
Validate JSON-LD with an appropriate free structured-data validator and confirm
that FAQ schema exactly matches visible content. No verified 1200 × 630 social
sharing image or logo asset currently exists, so metadata intentionally omits
image references. Create and approve those assets in a future scoped task.

## Make.com, Sheets, and recruiter email

Activate and verify all three scenarios described in `make-integration.md`.
Require expected event types and the optional shared secret. Using fictional
demonstration data, confirm one matching row and recruiter notification for each
form, consistent submission IDs, controlled failures, and duplicate handling.
Review Sheet and email access, retention, deletion, and incident procedures.

## Pre-deployment checks

1. Import and review the still-pending approved planning and policy documents.
2. Obtain qualified review of the privacy and terms drafts.
3. Run `npm ci`, `npm run lint`, and `npm run build`.
4. Confirm no secrets, webhook URLs, personal data, or test artifacts are tracked.
5. Verify titles, descriptions, canonicals, Open Graph tags, robots, sitemap,
   JSON-LD, favicon, security headers, and controlled error responses.
6. Test keyboard navigation, focus states, Talia, mobile navigation, cookie
   preferences, FAQs, and all forms at 320, 360, 390, 768, 1024, and 1440 pixels.
7. Add a deployment-tested nonce-based Content Security Policy. A CSP is not
   included in Sprint 10 because a static policy without final domain and
   deployment testing could break Next.js scripts or styles. Consider
   `frame-ancestors` then; `X-Frame-Options: DENY` is the current fallback.
8. Add HSTS only after the final domain and every required subdomain are
   confirmed HTTPS-ready.

## Post-deployment checks

- Request every public route, an invalid route, `/robots.txt`, and `/sitemap.xml`.
- Inspect rendered metadata and structured data from the production origin.
- Submit one fictional employer, candidate, and contact record; confirm the
  matching Make execution, Sheet row, and recruiter email.
- Confirm API, timeout, rate-limit, and upstream-failure messages remain controlled.
- Confirm no horizontal overflow, clipped controls, hydration warnings, missing
  assets, console errors, or overlap between Talia and the preference notice.
- Confirm Talia calls only `/api/talia`, stores no conversation, and makes no
  external AI request.

## Monitoring and rollback

Keep the previous known-good deployment available. Record the release identifier,
environment changes, and Make scenario versions. If forms, metadata, headers, or
critical navigation regress, disable affected Make scenarios where necessary and
roll back to the previous deployment through the hosting platform. Rotate any
secret or webhook URL exposed during deployment or diagnostics.
