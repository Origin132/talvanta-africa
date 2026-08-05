# Authentication

Ticket 013 adds Supabase email/password authentication for candidate and employer accounts. Supabase Auth remains the identity and session authority; the application does not issue JWTs, store passwords, or use a service-role key.

## Architecture and routes

Server Actions validate and submit `/sign-up`, `/sign-in`, `/forgot-password`, and `/reset-password`. Two server Route Handlers establish cookie-backed sessions: `/auth/callback` exchanges PKCE codes, while `/auth/confirm` verifies email token hashes. `/verify-email` explains confirmation requirements. `/account` is a server-protected placeholder and redirects unauthenticated visitors to `/sign-in?next=/account`.

Signup accepts only `full_name` and `account_type` metadata. Account type must be `candidate` or `employer`; it is onboarding information and is not an authorization role. The Confirm Signup email sends the token hash to `/auth/confirm`, which verifies it server-side and redirects to `/account`. The account router then uses the database profile to select candidate or employer onboarding/dashboard. Sign-in defaults to `/account`. Forgot-password responses remain neutral to reduce account enumeration. The Reset Password email sends its token hash to `/auth/confirm`; successful recovery verification establishes the Supabase session, adds a 15-minute HTTP-only recovery-intent marker, and redirects to `/reset-password`. Password update requires both the authenticated user and recovery marker, then clears the marker after success.

Token-hash email links do not depend on a PKCE verifier stored in the browser that initiated signup or recovery. They can therefore be opened on another device or in an email application's in-app browser. Supabase token hashes are still short-lived, single-use credentials: expired, malformed, prefetched, or previously consumed links receive only a neutral application message. Do not log or retain them.

The legacy `/auth/callback` route remains available for existing PKCE links and future OAuth flows. It exchanges `code` with `exchangeCodeForSession()`, preserves the recovery marker behavior for `/reset-password`, and applies the same internal redirect validation. New Supabase email templates use `/auth/confirm` instead.

The existing Next.js Proxy refreshes cookies. It does not decide authorization. The `@supabase/ssr` server client writes sessions established by `verifyOtp()` or `exchangeCodeForSession()` to HTTP-only session cookies. `/account` and recovery actions validate the user with `getUser()` on the server. Safe redirects accept only internal relative paths, rejecting external, protocol-relative, backslash, and control-character inputs. `/auth/confirm` additionally permits only the exact pairs `type=email` with `next=/account` and `type=recovery` with `next=/reset-password`; duplicated, missing, unexpected, or mismatched parameters fail closed.

## Configuration

Keep these public values in ignored local configuration and Vercel protected settings:

```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

In Supabase Authentication > URL Configuration, manually set the production Site URL to `https://talvanta-africa.vercel.app` and allow the intended application URLs, including `http://localhost:3000/**` for local development and `https://talvanta-africa.vercel.app/**` for production. Require email confirmation and review the password policy, CAPTCHA options, and Supabase Auth rate limits before launch. Never add secrets to public variables.

In Supabase Authentication > Email Templates, replace the link target in **Confirm signup** with this exact token-hash application URL (the surrounding email copy and link label may remain branded):

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/account">Confirm email address</a>
```

Replace the link target in **Reset password** with:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">Reset password</a>
```

`.SiteURL` and `.TokenHash` are supported Supabase Go-template variables. These templates intentionally avoid `.ConfirmationURL`, whose code-based browser flow can depend on the initiating browser's PKCE verifier. Save both templates manually in the Supabase dashboard. Disable link tracking in any external email provider, and account for security scanners that may prefetch and consume one-time links.

Set `NEXT_PUBLIC_SITE_URL=https://talvanta-africa.vercel.app` in the Vercel Production environment. Production builds require this canonical value and reject localhost. The existing signup `emailRedirectTo` and recovery `redirectTo` continue to point at `/auth/callback` for compatibility with code-based links, but the new dashboard templates use `.SiteURL` to send token hashes to `/auth/confirm`. Local development may set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. Redeploy after changing a `NEXT_PUBLIC_` value because Next.js freezes public environment variables at build time.

## Security and limitations

Forms and confirmation routes reject unexpected fields, constrain inputs, never log credentials or token hashes, and expose only controlled errors. Raw Supabase errors, tokens, query contents, cookies, sessions, email addresses, and project identifiers are not displayed or logged. No service-role key, browser token storage, public administrator logic, or role-changing behavior is introduced. Supabase's configured protections provide auth-call rate limiting for this ticket; no custom password endpoint or IP logging was added. This does not claim complete abuse prevention. Review production bot protection and email-delivery health before launch.

Ticket 014 subsequently connects authentication to existing RLS-protected profile tables. Database `profiles.account_type`, not Auth metadata, is authoritative after profile creation. See `database-profiles-and-rls.md`. Dashboards, administrator access, CV upload, Storage policies, account deletion, MFA, social login, vacancy management, and private-document handling remain excluded.

## Testing and troubleshooting

Run `npm run lint` and `npm run build`. Manually test candidate and employer signup confirmation on the initiating browser, another device, and an email in-app browser. Confirm each valid email token works once, reaches `/account`, and is routed by the database profile; then retry the same link and confirm the neutral verification failure. Test recovery in the same three browser/device combinations, confirm the valid link reaches `/reset-password`, and verify password update requires both the authenticated recovery session and recovery marker. Retry used and expired links and confirm the neutral recovery failure.

Test `/auth/confirm` with missing and duplicated parameters, unsupported types, type/destination mismatches, `next=https://example.com`, `next=//example.com`, backslashes, and encoded control characters. None may verify or redirect externally. Retest an existing PKCE `/auth/callback?code=...` link, callback failure, valid/invalid sign-in, neutral recovery request, sign-out, and the `/account` guard. Repeat relevant pages at 320, 360, 375, 390, 768, 1024, and 1440 pixels with keyboard-only navigation.

If confirmations fail, confirm the saved email templates use the exact `/auth/confirm` links above and that Supabase Site URL is `https://talvanta-africa.vercel.app`. If callbacks fail, confirm the Vercel Production value is exactly `NEXT_PUBLIC_SITE_URL=https://talvanta-africa.vercel.app` and that the Supabase redirect allow-list contains `https://talvanta-africa.vercel.app/auth/callback`. Do not set the production value to localhost. If sessions disappear, verify the SSR cookie client, Proxy cookie refresh, HTTPS settings, and CDN cache behavior. If email does not arrive, inspect Supabase Auth email configuration without logging addresses, codes, token hashes, cookies, or provider error objects.
