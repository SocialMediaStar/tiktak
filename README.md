# TikPop

Localized Next.js starter for a paid creator product. The current stack includes:

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + Neon Postgres
- Auth.js / NextAuth email magic-link auth
- Resend for transactional auth email
- Vercel deployment

## Current Production

- Production URL: `https://tiktak-pi.vercel.app`
- Localized routes: `/et`, `/en`
- Email auth: enabled
- Google auth: code-ready, waiting for Google OAuth credentials
- TikTok auth: not implemented yet
- Stripe + Pusher: wrappers and placeholders only

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy envs:

```bash
cp .env.example .env
```

3. Fill at minimum:

```env
DATABASE_URL=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
```

4. Generate Prisma client and sync schema:

```bash
npx prisma generate
npx prisma db push
```

5. Start the app:

```bash
npm run dev
```

## Deployment

The project is linked to Vercel and deploys from `main`.

Required Vercel env vars:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Optional next-step env vars:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PUSHER_APP_ID`
- `PUSHER_KEY`
- `PUSHER_SECRET`
- `PUSHER_CLUSTER`
- `NEXT_PUBLIC_PUSHER_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`

Notes:

- `NEXTAUTH_URL` is set in production to the Vercel alias.
- Preview should not use a hardcoded localhost `NEXTAUTH_URL`.
- Prisma generator includes `rhel-openssl-3.0.x` so Vercel runtime can load the query engine.

## Implemented Flows

- Landing page with auth modal in navbar
- Email magic-link sign-in and sign-up entry points
- Localized verify-request page
- Protected dashboard
- Sign out
- Waitlist form persisted to database

## Remaining Product Work

- Google OAuth credentials and callback verification
- TikTok Login Kit integration
- Stripe checkout + subscription management
- Pusher realtime features
- Creator/admin product screens
