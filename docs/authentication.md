# Authentication

Ticket 013 adds Supabase email/password authentication for candidate and employer accounts. Supabase Auth remains the identity and session authority; the application does not issue JWTs, store passwords, or use a service-role key.

## Architecture and routes

Server Actions validate and submit `/sign-up`, `/sign-in`, `/forgot-password`, and `/reset-password`. `/auth/callback` exchanges the one-time PKCE code for cookie-backed session data. `/verify-email` explains confirmation requirements. `/account` is a server-protected placeholder and redirects unauthenticated visitors to `/sign-in?next=/account`.

Signup accepts only `full_name` and `account_type` metadata. Account type must be `candidate` or `employer`; it is onboarding information and is not an authorization role. Email confirmation sends users through `/auth/callback`, then `/account`. Sign-in defaults to `/account`. Forgot-password responses are neutral to reduce account enumeration. Recovery uses `/auth/callback?next=/reset-password`; the callback establishes the Supabase session plus a 15-minute HTTP-only recovery-intent marker. Password update requires both and clears the marker after success.

The existing Next.js Proxy refreshes cookies. It does not decide authorization. `/account` and recovery actions validate the user with `getUser()` on the server. Safe redirects accept only internal relative paths, rejecting external, protocol-relative, backslash, and control-character inputs.

## Configuration

Keep these public values in ignored local configuration and Vercel protected settings:

```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

In Supabase Auth URL Configuration, manually set the production Site URL to the approved deployment origin (currently `https://talvanta-africa.vercel.app`) and allow the intended callback patterns, including `http://localhost:3000/**` for local development and `https://talvanta-africa.vercel.app/**` for production. Require email confirmation and review the email templates, password policy, CAPTCHA options, and Supabase Auth rate limits before launch. Never add secrets to public variables.

Set `NEXT_PUBLIC_SITE_URL=https://talvanta-africa.vercel.app` in the Vercel Production environment. Production builds require this canonical value and reject localhost. Signup builds `emailRedirectTo` from that origin, producing `https://talvanta-africa.vercel.app/auth/callback?next=/account`. Password recovery passes `https://talvanta-africa.vercel.app/auth/callback?next=/reset-password` as `redirectTo` to Supabase. Local development may set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, producing `http://localhost:3000/auth/callback?next=/reset-password`. Redeploy after changing a `NEXT_PUBLIC_` value because Next.js freezes public environment variables at build time.

## Security and limitations

Forms reject unexpected fields, constrain inputs, never log credentials, and expose only controlled errors. Supabase's configured protections provide auth-call rate limiting for this ticket; no custom password endpoint or IP logging was added. This does not claim complete abuse prevention. Review production bot protection and email-delivery health before launch.

Ticket 014 subsequently connects authentication to existing RLS-protected profile tables. Database `profiles.account_type`, not Auth metadata, is authoritative after profile creation. See `database-profiles-and-rls.md`. Dashboards, administrator access, CV upload, Storage policies, account deletion, MFA, social login, vacancy management, and private-document handling remain excluded.

## Testing and troubleshooting

Run `npm run lint` and `npm run build`. Manually test both account types, validation failures, confirmation links, callback failure, valid/invalid sign-in, neutral recovery request, valid/expired reset links, sign-out, the `/account` guard, and malicious external `next` values. Repeat at 320, 360, 375, 390, 768, 1024, and 1440 pixels with keyboard-only navigation.

If callbacks fail, confirm the Vercel Production value is exactly `NEXT_PUBLIC_SITE_URL=https://talvanta-africa.vercel.app` and that the Supabase redirect allow-list contains `https://talvanta-africa.vercel.app/auth/callback`. Do not set the production value to localhost. If sessions disappear, verify Ticket 012 Proxy cookie refresh and HTTPS settings. If email does not arrive, inspect Supabase Auth email configuration without logging addresses, codes, tokens, cookies, or provider error objects.
