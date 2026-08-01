# Supabase foundation

Ticket 012 establishes the cookie-compatible Supabase client foundation for
future authentication, profiles, dashboards, and private document work. It does
not implement those product features, create external resources, or change the
existing public form workflows.

## Purpose and installed packages

The foundation uses the installed `@supabase/supabase-js` and `@supabase/ssr`
packages. Browser and server code receive separate client factories, while the
Next.js Proxy refreshes an existing Supabase Auth session before rendering.
There is no manual JWT handling and no custom session-cookie implementation.

`@supabase/ssr` is the supported replacement for the deprecated Auth Helpers,
but Supabase currently documents it as beta software whose API may change.
Review its release notes before future authentication tickets.

## Environment variables

Two intentionally public configuration values are required:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-reference.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_me
```

The publishable key is designed for use by public clients. It identifies the
project and applies the permissions available to the anonymous or authenticated
user. It is not a substitute for database authorization. Database and Storage
security will depend on correctly enabled and tested Row Level Security (RLS)
policies.

Never add a secret key or service-role key with a `NEXT_PUBLIC_` prefix. A
service-role key bypasses RLS and is not required or supported by this ticket.
No real value belongs in `.env.example`, documentation, logs, screenshots, or
commits.

`src/lib/supabase/env.ts` validates that both variables exist without printing
their values. Production requires an origin-only HTTPS `*.supabase.co` project
URL. Development also permits HTTP or HTTPS localhost origins for a local
Supabase instance.

## Client architecture

### Browser client

`src/lib/supabase/client.ts` exports `createClient()`, which uses
`createBrowserClient` with only the public project URL and publishable key. It
is safe to import from a future Client Component. It contains no service key,
business query, or logging.

### Server client

`src/lib/supabase/server.ts` is protected by `server-only`. Its async
`createClient()` factory uses Next.js 16's async `cookies()` API and
`createServerClient`. It reads request cookies and writes refreshed cookies in
Server Actions or Route Handlers where Next.js permits writes. During Server
Component rendering, only the documented cookie-write restriction is ignored;
unrelated errors are rethrown. The Proxy is responsible for refreshing cookies
before Server Components render.

Future authorization decisions must use a validated identity method such as
`supabase.auth.getClaims()` or, where a current Auth-server user record is
required, `getUser()`. Do not trust `getSession()` alone for server-side
authorization.

## Cookie-based session refresh

Next.js 16 uses `src/proxy.ts`, not the deprecated `middleware.ts` convention.
The Proxy calls `src/lib/supabase/proxy.ts` on page requests. The helper:

1. reads request cookies;
2. initializes the SSR server client;
3. calls `supabase.auth.getClaims()` to validate or refresh an existing token;
4. updates the request cookies made visible to Server Components;
5. writes refreshed cookies to the browser response; and
6. forwards the no-cache headers supplied by `@supabase/ssr` when cookies
   change.

The matcher excludes current `/api` routes, Next.js static and image assets,
the favicon, robots and sitemap outputs, common public images, scripts, styles,
maps, and fonts. The Proxy does not protect routes, redirect visitors, inspect
roles, or change Make.com form APIs. A future auth ticket must deliberately
review the matcher before adding callbacks or protected routes.

## Development configuration check

`src/lib/supabase/health.ts` provides the server-only
`checkSupabaseConfiguration()` utility. It validates configuration and confirms
that a non-persistent Supabase client can be initialized. It does not perform a
network request, query Auth, inspect a user, query a private table, access
Storage, or reveal configuration. There is intentionally no public diagnostic
page or API route.

Use the utility only from a controlled server-side development check or future
test. A successful `{ configured: true }` result confirms initialization, not
database availability, authentication health, RLS correctness, or an external
service-level guarantee.

## Current scope

Implemented in Ticket 012:

- typed environment validation;
- browser and server Supabase client factories;
- cookie-based session-refresh Proxy plumbing;
- a non-networked, server-only configuration check; and
- local and deployment setup documentation.

Intentionally not implemented:

- sign-up, sign-in, sign-out, recovery, or callback routes;
- protected layouts, redirects, role checks, or dashboards;
- profile, employer, candidate, vacancy, or application tables;
- migrations, seed data, database triggers, or RLS policies;
- Storage buckets, CV uploads, file validation, or retention rules; and
- any Supabase integration with the existing public forms.

## Local setup

1. Create or select the intended Supabase project outside this repository.
2. Copy `.env.example` to the ignored `.env.local` if needed.
3. Replace only the two Supabase placeholders in `.env.local` with the Project
   URL and publishable key from the Supabase project Connect dialog.
4. Do not add a secret or service-role key.
5. Restart `npm run dev` after an environment change.
6. Run `npm run lint` and `npm run build`.
7. Request representative public pages and existing APIs without submitting
   personal information.

The Proxy requires valid configuration on matched page requests. A controlled
developer-facing configuration error is expected when either value is absent or
invalid.

## Vercel setup

In **Vercel Project → Settings → Environment Variables**, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Add them to Development where needed, Preview only when preview authentication
testing is intended, and Production for the deployed foundation. Changing an
environment variable requires a new deployment or redeployment. Do not perform
these changes through repository code, and do not paste the values into tickets
or build logs.

## Troubleshooting

- **Missing-variable error:** confirm both exact names exist in `.env.local` or
  the selected Vercel environment, then restart or redeploy.
- **Invalid URL error:** use only the project origin. Remove paths, query
  parameters, fragments, and embedded credentials. Production must use HTTPS.
- **Repeated auth refreshes:** confirm the Proxy matcher runs on the relevant
  page and that both request and response cookies plus the supplied cache
  headers are preserved.
- **Unexpected logout:** check current `@supabase/ssr` guidance, project Auth
  settings, browser cookie policies, and the deployed HTTPS origin.
- **Build works but deployment fails:** confirm the variables were added to the
  same Vercel environment being deployed and redeploy after the change.

Never print a session, access token, refresh token, cookie value, publishable
key, or Supabase error object during troubleshooting.

## Security limitations and production readiness

This foundation does not make the application authenticated or authorize data
access by itself. Before any personal, recruitment, or document data enters
Supabase:

- design and review the database schema;
- enable RLS on every exposed table and test policies for anonymous,
  authenticated, and cross-account access;
- create private Storage buckets and tested object policies;
- define file type, size, malware-review, access, retention, and deletion rules;
- add production-grade abuse protection and audit requirements;
- review session caching and ensure responses that set auth cookies are never
  shared by a CDN; and
- update privacy and terms information after qualified review.

No database table, migration, RLS policy, Storage bucket, authentication UI, or
CV upload exists as a result of this ticket.

## Next planned ticket

The next scoped ticket should define authentication journeys and authorization
requirements before adding UI. It should include callback behavior, redirect
allow-lists, error handling, verified identity checks, session tests, and a
reviewed RLS model. Database profiles and private documents should remain
separate, later scopes.
