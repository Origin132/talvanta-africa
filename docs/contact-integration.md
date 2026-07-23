# Sprint 9 contact enquiry workflow

The contact form posts JSON only to `POST /api/contact`. The internal route
applies the same controls as the employer and candidate routes: same-origin
checking, `application/json` enforcement, a 64 KB body limit, an allow-listed
shape, honeypot handling, a process-local five-request-per-10-minute limit,
independent server validation, controlled responses, and minimal safe logging.

Valid enquiries are mapped into the versioned `contact.enquiry.created` webhook
payload and forwarded once to `MAKE_CONTACT_WEBHOOK_URL`. The website does not
write to Google Sheets or send email directly. Make.com must be configured
manually to add a `Contact Enquiries` worksheet row and send the recruiter
notification described in `make-integration.md`.

Required contact fields are full name, email, enquiry type, subject, message,
and processing/follow-up consent. Organisation and telephone are optional.
Honeypot fields, client identifiers, IP addresses, secrets, user-agent strings,
and error references are never added to the payload.

Missing or invalid webhook configuration returns 503; upstream non-2xx returns
502; timeout returns 504. The form retains entries after failure. There is no
automatic retry, persistence queue, or guarantee against duplicate records.
The in-memory limiter resets on restart and is not shared across server
instances, so production requires platform-level or distributed protection.

For local integration testing, configure a controlled local mock webhook or a
dedicated Make.com demonstration scenario, submit fictional data, and confirm
one row and one notification with the matching submission ID. Never use real
personal data or commit webhook URLs and secrets.
