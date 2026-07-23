# Sprint 8 Talia mock mode

Talia is currently a deterministic, rule-based demonstration assistant. It is
available globally through an accessible floating launcher and sends typed JSON
requests only to the internal `POST /api/talia` route. The route validates the
request and selects an approved response locally. It does not call OpenAI,
Make.com, Google Sheets, Gmail, a database, analytics, or any other external
service.

## Architecture and request contract

The browser retains at most 16 recent messages in React memory and sends:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What services do you offer?"
    }
  ]
}
```

Only `user` and `assistant` roles are accepted. The final message must be a
non-empty user message. A successful response preserves the same contract
intended for a future AI-backed generator:

```json
{
  "success": true,
  "message": {
    "role": "assistant",
    "content": "Talvanta Africa provides...",
    "internalLink": {
      "label": "View services",
      "href": "/services"
    }
  }
}
```

The server rejects unsupported content types, malformed JSON, unknown request or
message properties, unsupported roles, blank content, more than 16 messages,
user messages over 1,500 characters, assistant-history messages over 3,000
characters, and bodies over 30 KB.

## Rule-based response engine

The matcher normalises case, punctuation, and whitespace, then evaluates
specific phrases before broad keywords. Safety boundaries are checked first:
prompt-injection requests, sensitive information, candidate ranking, hiring
decisions, guarantees, legal advice, and immigration advice.

Supported informational categories are greetings, employer support, candidate
support, services, permanent recruitment, temporary and contract staffing,
executive search, graduate recruitment, candidate screening, HR advisory,
hiring process, candidate registration, vacancies, and human handoff. Questions
outside approved information receive a controlled uncertainty response.

The approved response catalogue is the only source of chat answers. Talia does
not fabricate vacancies, rank or score candidates, make hiring decisions,
provide legal or immigration advice, or guarantee recruitment outcomes.

## Privacy and security limitations

Conversation state exists only in React memory. Refreshing or closing the page
may clear it. No cookies, browser storage, files, database records, or external
workflow records are created.

The endpoint applies same-origin checking, a 30 KB body limit, controlled JSON
errors, and a separate limit of 15 requests per 10 minutes using a hashed,
privacy-conscious client identifier. The limiter is process-local: it resets on
restart, can differ across server instances, and is not production-grade
distributed protection. Same-origin checking is an additional safeguard, not a
claim of complete CSRF protection.

Full chat messages, request bodies, and response content are not logged.
Unexpected errors log only a category and random correlation identifier.

## Local testing

Run:

```bash
npm run dev
npm run lint
npm run build
```

Verify the launcher, dialog focus movement, Escape-to-close, focus return,
Enter-to-send, Shift+Enter newline, clear control, retry state, quick actions,
internal links, and layouts from 320px through desktop. Test all supported and
boundary prompts listed in the Sprint 8 mock-mode brief. Confirm that the
Network panel contains only the internal `/api/talia` request.

## Future upgrade path

To introduce OpenAI later, replace the deterministic response-generator call in
`src/app/api/talia/route.ts` with a reviewed server-only generator. Keep the
validation, security controls, frontend request contract, and controlled
response contract stable. Any future AI integration requires separate approval,
server-only credentials, updated privacy disclosure, safety testing, and
production-grade abuse protection.
