# Sprint 7 Make.com integration guide

This guide separates repository code from the manual Make.com, Google Sheets, and email-provider work required to operate the recruitment workflows. It does not claim that those external resources have been created or tested against a live account.

## Repository configuration

1. Copy `.env.example` to `.env.local`.
2. Set `MAKE_EMPLOYER_WEBHOOK_URL` and `MAKE_CANDIDATE_WEBHOOK_URL` to the two real Make.com custom webhook URLs.
3. Optionally set `MAKE_WEBHOOK_SHARED_SECRET` to a long random value and configure both scenarios to verify the `X-Talvanta-Webhook-Secret` header.
4. Keep `MAKE_WEBHOOK_TIMEOUT_MS=10000` unless a deliberately tested value from 100 to 30000 milliseconds is required.
5. Restart Next.js after changing environment values.
6. Never commit `.env.local`. Rotate a webhook URL or secret immediately if it is exposed.

The browser calls only the website APIs. Webhook URLs and the optional secret are read at request time by server-only code. Each valid submission is forwarded once with `cache: "no-store"`; there is no automatic retry or persistence queue.

## Payload contract

Both scenarios receive `schemaVersion: "1.0"`, a random `submissionId`, an ISO `submittedAt` timestamp, `source: "talvanta-africa-website"`, and the runtime environment. Employer events use `employer.hiring_enquiry.created`; candidate events use `candidate.registration.created`.

Only validated form fields are mapped into `data`. Honeypots, rate-limit identifiers, IP addresses, user-agent strings, secrets, and internal error references are never included.

## Scenario A: Employer Hiring Enquiry

Recommended modules:

1. **Webhooks — Custom webhook** using the employer URL.
2. **Filter** requiring `eventType` to equal `employer.hiring_enquiry.created` and verifying the optional shared-secret header where supported. Otherwise, apply a scenario-level filter before processing.
3. **Tools or JSON** to map and normalise version 1.0 fields.
4. **Google Sheets — Add a row** for the employer record.
5. **Email — Send a recruiter notification** through the approved provider.
6. **Webhooks — Webhook response** returning 2xx only after required modules succeed.

## Scenario B: Candidate Registration

Recommended modules:

1. **Webhooks — Custom webhook** using the candidate URL.
2. **Filter** requiring `eventType` to equal `candidate.registration.created` and verifying the optional shared-secret header where supported. Otherwise, apply a scenario-level filter before processing.
3. **Tools or JSON** to map and normalise version 1.0 fields.
4. **Google Sheets — Add a row** for the candidate record.
5. **Email — Send a recruiter notification** through the approved provider.
6. **Webhooks — Webhook response** returning 2xx only after required modules succeed.

Exact module names can vary by Make.com interface and connected email provider. A shared-secret header is an additional check, not complete webhook security.

## Google Sheets design

Recommended workbook: **Talvanta Africa Recruitment Leads**.

### Employer Enquiries worksheet

Columns, in order:

`Submission ID`, `Submitted At`, `Source`, `Organisation Name`, `Contact Person`, `Work Email`, `Telephone`, `Organisation Website`, `Organisation Location`, `Job Title`, `Department`, `Employment Type`, `Number of Positions`, `Workplace Arrangement`, `Job Location`, `Preferred Start Date`, `Recruitment Timeline`, `Main Responsibilities`, `Required Skills`, `Required Experience`, `Education Requirements`, `Salary Range`, `Additional Information`, `Preferred Service`, `Recruited Before`, `Information Accuracy Consent`, `Service Agreement Acknowledgement`, `Processing Consent`, `Marketing Consent`, `Lead Status`, `Recruiter Notes`.

Make.com should assign the default lead status `New`; the website payload does not assign it.

### Candidate Registrations worksheet

Columns, in order:

`Submission ID`, `Submitted At`, `Source`, `Full Name`, `Email`, `Telephone`, `Current Location`, `Preferred Work Location`, `Professional Profile URL`, `Current Job Title`, `Employment Status`, `Years of Experience`, `Highest Education Level`, `Area of Study`, `Professional Qualifications`, `Key Skills`, `Experience Summary`, `Industry Experience`, `Recent Achievements`, `Preferred Employment Types`, `Workplace Preferences`, `Preferred Roles`, `Salary Expectation`, `Availability`, `Career Interests`, `CV Summary`, `Information Accuracy Consent`, `No Guarantee Acknowledgement`, `Processing Consent`, `Human Decision Acknowledgement`, `Marketing Consent`, `Candidate Status`, `Recruiter Notes`.

Make.com should assign the default candidate status `Registered`. Join array values with a readable delimiter such as `Permanent | Contract | Remote` instead of storing raw JSON arrays unless a deliberate alternative is approved.

## Recruiter notification templates

Make.com—not Next.js—should send these notifications. User confirmation emails remain out of scope.

Employer subject: `New Talvanta Africa Hiring Enquiry — {{jobTitle}} — {{organisationName}}`

Include the submission reference and time, organisation and contact details, role title, location, employment type, number of positions, preferred service, recruitment timeline, a concise responsibilities summary, and a workbook or row link where practical.

Candidate subject: `New Talvanta Africa Candidate Registration — {{fullName}} — {{currentJobTitle}}`

Include the submission reference and time, candidate contact details, current and preferred locations, current or recent role, years of experience, employment and workplace preferences, availability, a concise skills summary, and a workbook or row link where practical.

Keep notifications concise and retain long free-text details in the worksheet. Do not claim confidentiality or encryption unless the configured provider supports and documents it.

## Failure and duplicate handling

The website reports missing configuration or network unavailability as 503, upstream non-2xx responses as 502, and timeouts as 504. It does not report success unless Make.com returns 2xx. Upstream response bodies are ignored and never sent to the browser.

There is no persistent queue and no automatic retry because either could create duplicate rows or notifications. A user retry creates a new submission ID. Where practical, Make.com should check whether a submission ID already exists before adding a row. This reduces duplicates but is not complete idempotency.

## Manual verification checklist

- Confirm each scenario rejects unexpected event types and verifies the optional secret.
- Submit clearly labelled demonstration employer and candidate records.
- Confirm exactly one matching worksheet row and one recruiter notification per submission.
- Confirm the submission ID matches the website, worksheet, and notification.
- Confirm long free-text fields are not copied wholesale into email.
- Confirm a stopped scenario or controlled non-2xx response produces a website failure without clearing the form.
- Confirm no real credentials, webhook URLs, or demonstration personal data are committed.
