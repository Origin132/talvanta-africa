# Sprint 11 Vercel deployment and launch guide

This is a controlled manual runbook. It does not authorise automatic deployment,
domain purchase, DNS changes, external-service changes, or committing secrets.

## Compatibility summary

Vercel can detect this repository as a standard Next.js App Router project. The
root `package.json` uses npm and provides `dev`, `build`, `start`, and `lint`
scripts. The application needs no custom server, writable local filesystem,
long-running worker, rewrite, region setting, or `vercel.json`.

The actual APIs are:

- `POST /api/hire-talent`
- `POST /api/candidate-registration`
- `POST /api/contact`
- `POST /api/talia`

The three form routes run as serverless-compatible Next.js route handlers.
Talia is deterministic and local; it requires no OpenAI configuration. The
process-local rate limiter resets and is not shared across serverless instances,
so it is only burst protection. Add production-grade distributed or
platform-level rate limiting in a separately approved task.

## Production environment variables

Add these in Vercel Project Settings, separately for the Production environment:

| Variable | Purpose |
| --- | --- |
| `MAKE_EMPLOYER_WEBHOOK_URL` | Employer Make.com custom webhook |
| `MAKE_CANDIDATE_WEBHOOK_URL` | Candidate Make.com custom webhook |
| `MAKE_CONTACT_WEBHOOK_URL` | Contact Make.com custom webhook |
| `MAKE_WEBHOOK_TIMEOUT_MS` | Integer from 100 to 30000; normally `10000` |
| `MAKE_WEBHOOK_SHARED_SECRET` | Strong secret also verified by all scenarios |
| `NEXT_PUBLIC_SITE_URL` | Final public HTTPS origin, without a path |

Webhook URLs and the shared secret are server-only and must never use a
`NEXT_PUBLIC_` prefix. `NEXT_PUBLIC_SITE_URL` is intentionally public because it
generates canonicals, Open Graph URLs, robots, sitemap, and JSON-LD.

Do not copy `.env.local` into documentation or Git. Use Vercel’s protected
environment-variable interface. Changing a variable does not alter an existing
deployment: create a new deployment or redeploy after every environment change.

## Initial Vercel deployment

1. Run `git status` and confirm only intended release changes exist.
2. Run `npm run lint` and `npm run build`.
3. Inspect `git diff`, then ensure no secrets or personal test data are staged.
4. Push the reviewed latest `main` branch to the existing remote repository.
5. Sign in to Vercel and import the existing Git repository.
6. Confirm the framework preset is **Next.js**.
7. Confirm the root directory is the repository root containing `package.json`.
8. Keep the default install and build settings.
9. Add the five Make.com variables. `NEXT_PUBLIC_SITE_URL` may be omitted only
   for the first Vercel deployment: the application can bootstrap metadata from
   Vercel’s trusted generated HTTPS URL.
10. Deploy and inspect all build logs.
11. Open the generated `vercel.app` production URL.
12. Set `NEXT_PUBLIC_SITE_URL` to that exact HTTPS origin.
13. Redeploy so every canonical, Open Graph URL, sitemap entry, robots reference,
    and JSON-LD URL uses the stable production origin.
14. Complete every post-deployment test below before announcing availability.

Production URL validation rejects non-HTTPS public origins. Local development
may use `http://localhost:3000`. Trailing slashes are removed consistently.

## Make.com, Google Sheets, and Gmail readiness

Before form testing, confirm all three scenarios are active:

```text
Employer webhook → Google Sheets → Gmail → Webhook Response
Candidate webhook → Google Sheets → Gmail → Webhook Response
Contact webhook → Google Sheets → Gmail → Webhook Response
```

For each scenario:

- Its webhook URL must match the corresponding Vercel variable.
- Its expected event type and shared-secret check must match the website.
- Google Sheets mappings and destination worksheets must be reviewed.
- The Gmail connection must remain authorised.
- The final Webhook Response module must return a timely 2xx only after required
  processing succeeds.
- Use clearly labelled fictional production-test records and never sensitive
  candidate information.
- Remove test records only after the submission ID, row, email, and website
  result have been reconciled.

Never expose webhook URLs or the shared secret in screenshots, tickets, commits,
or browser diagnostics.

## Public post-deployment checklist

Request and visually inspect:

- `/`
- `/about`
- `/services`
- `/jobs`
- `/employers`
- `/job-seekers`
- `/hire-talent`
- `/candidate-registration`
- `/contact`
- `/faqs`
- `/privacy`
- `/terms`
- `/robots.txt`
- `/sitemap.xml`
- one invalid route for the branded 404

Confirm:

- Header, mobile menu, footer, CTAs, and internal links work.
- Cookie Accept, Reject non-essential, and Dismiss controls work.
- Talia opens, closes, clears, answers approved prompts, calls only
  `/api/talia`, stores no conversation, and makes no external AI request.
- FAQ accordions, legal-page readability, keyboard order, visible focus states,
  skip link, and dialog focus behavior remain usable.
- Canonical and Open Graph URLs use the current HTTPS production origin.
- Robots references the production sitemap; all sitemap URLs use that origin.
- Organization, WebSite, Service, and FAQ JSON-LD parse and match visible content.
- No mixed-content warning, missing asset, obvious console error, or project
  hydration error appears.
- Layouts have no horizontal overflow or clipped controls at 320, 360, 390, 768,
  1024, and 1440 pixels.
- Security responses include `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, and `Permissions-Policy`.

CSP remains a post-deployment action: implement a nonce-based policy only after
testing it against the deployed Next.js scripts, styles, forms, and Talia. Add
HSTS only when every required hostname is confirmed HTTPS-ready.

## Production form checklist

Use different clearly labelled fictional values for every form.

### Hire Talent

- Trigger client and server validation errors.
- Submit one valid record.
- Confirm duplicate-click prevention, website success message, reference,
  employer Sheet row, recruiter email, and matching submission ID.

### Candidate Registration

- Trigger client and server validation errors.
- Submit one valid record without real sensitive information.
- Confirm array-field formatting, duplicate-click prevention, website success
  message, reference, candidate Sheet row, recruiter email, and matching ID.

### Contact

- Trigger client and server validation errors.
- Submit one valid record.
- Confirm duplicate-click prevention, website success message, reference,
  `Contact Enquiries` row, recruiter email, and matching ID.

Also test controlled scenario downtime or non-2xx behavior. The website must
retain form entries and return a safe failure without exposing webhook details.

## Custom-domain procedure

Do not invent DNS values. When an approved domain becomes available:

1. Add it in Vercel Project Settings.
2. Apply only the exact DNS records Vercel currently displays.
3. Wait for Vercel DNS verification and HTTPS certificate issuance.
4. Choose the preferred primary hostname and configure the secondary hostname
   redirect where appropriate.
5. Update `NEXT_PUBLIC_SITE_URL` to the preferred HTTPS origin.
6. Redeploy.
7. Retest canonicals, Open Graph URLs, robots, sitemap, JSON-LD, forms, and
   same-origin rejection from an unrelated origin.

## Git release workflow

Review before executing:

```bash
git status
npm run lint
npm run build
git add .
git diff --cached
git status
git commit -m "chore: prepare sprint 11 production deployment"
git push origin main
```

Do not stage or commit `.env.local`, webhook URLs, shared secrets, real personal
data, screenshots containing secrets, or production-test exports.

## Rollback and recovery

Do not delete the working production deployment. If a deployment fails:

1. Inspect Vercel build and function logs without copying secrets or form data.
2. Reproduce and correct the issue locally.
3. Run lint and build.
4. Review, commit, and push the fix.
5. Redeploy, or use Vercel’s previous successful deployment/rollback capability
   where appropriate.
6. Recheck the homepage, metadata, Talia, and all three forms after restoration.

Rollback has not been executed or tested during Sprint 11.
