# VisPlay by Visibyl Technologies

**Slogan:** Great Movies. Small Coins. Big Entertainment.

This repository is the initial full-stack application foundation for VisPlay. It is intentionally not represented as a finished streaming business: payments, protected video playback, complete authentication UX, creator review workflows, uploads, live streaming, and production deployment still require implementation and verification. Payment endpoints fail closed until verification is completed.

## Stack

- Next.js App Router + React + TypeScript
- PostgreSQL + Prisma ORM
- Signed, HTTP-only JWT session cookie using `jose`; bcrypt password hashes
- S3-compatible private media storage via AWS SDK
- Paystack integration points (server-side secret only)

## What is implemented in this foundation

- Responsive, dark cinematic discovery page branded VisPlay; database-backed published movie listing and honest empty/error states
- PostgreSQL Prisma data model for users, creator applications, movies, bundles, wallet ledger, purchases, creator earnings/payouts, likes, follows, comments, viewing events, notifications, reports, livestreams, rewards, ad campaigns, settings and audit logs
- Registration API with schema validation, bcrypt password hashing, unique email handling, wallet creation and an HTTP-only signed session
- Server-side session and role guard helpers
- Published movie listing API with search and pagination
- Database health endpoint
- Integer-kobo pricing constants: ₦100 movie unlock, ₦300 bundle, 90% creator / 10% platform revenue split, 600-second preview
- Media read endpoint that checks database references and returns short-lived signed URLs for posters/profile/channel images; video objects are not served by this endpoint
- Paystack webhook signature validation skeleton that intentionally does not credit a wallet before provider verification/reconciliation is implemented

## Run locally

1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a random `AUTH_SECRET` of at least 32 characters.
3. Configure a private S3-compatible bucket and its credentials for media storage.
4. Run:

   ```bash
   npm install
   npx prisma format
   npx prisma validate
   npx prisma migrate dev --name initial
   npm run dev
   ```

5. Open `http://localhost:3000`. `GET /api/health` checks database connectivity.

Do not commit `.env`. Do not use Paystack live keys until the transaction initialization, server-side reference verification, webhook idempotency, atomic ledger updates, refunds/reversals and sandbox tests are complete.

## Important product invariants

- Store currency amounts as integer kobo (`BigInt` in the database); never use floating-point math for ledger operations.
- Public movie discovery only returns `PUBLISHED` records.
- User role and account status must be re-read server-side for every privileged action; never trust a role supplied by the browser.
- Movie unlocks must be verified purchases associated with the user and movie. The player must request authorized playback through the backend; hiding a control in React is not security.
- Preview access stops at 600 seconds. Seeking directly past the preview must not bypass authorization.
- Bundle purchases grant access to the configured bundle as a single ₦300 purchase, not ten individual ₦100 purchases.
- Creator ledger entries are derived from verified, eligible purchases and use the 90/10 split. Payout processing is monthly.
- Demo fixtures, if added, must be explicitly marked `isDemo`; never fabricate users, sales, view counts, payment success, or earnings.

## Required implementation before production

1. Complete login/logout/session rotation, CSRF/rate-limit protections, password reset, email verification and profile edit/upload routes.
2. Creator application submission/review API and UI; transactionally approve/reject, create creator profile, enforce one pending application, write audit log, and gate all creator APIs.
3. Actual multipart/resumable video and image uploads to private object storage with MIME/size validation, progress, cleanup and storage lifecycle rules.
4. Movie upload/review/publish APIs, admin dashboard, user management and audit views.
5. Paystack initialization and provider API verification, idempotent webhook processing, atomic wallet ledger balance updates, movie/bundle purchase authorization and reconciliation tests. Flutterwave only if separately configured.
6. Protected video delivery with short-lived signed playback URLs or a streaming provider capable of enforcing time-limited access; server-authoritative preview enforcement, resume position and PiP support detection.
7. Likes, comments/replies/reporting, follows, notifications, real analytics event deduplication, conversion attribution and creator earnings reports.
8. Live streaming and premieres through a configured real provider; do not expose a static video as a livestream.
9. Rewards rules, ad campaign review/delivery, monthly payout approvals, backups, monitoring, privacy/retention controls and deployment smoke tests.
10. Automated unit, integration, security and end-to-end tests for every workflow in the product brief.

## Branding note

No official VisPlay logo file was present in the available project workspace when this foundation was created. The wordmark currently uses a typographic gradient V as a temporary treatment, not as a claim to reproduce the official ribbon logo. Replace it with the supplied official asset when available.
