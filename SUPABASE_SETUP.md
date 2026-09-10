# Supabase and Vercel setup

1. Create a Supabase project, open **SQL Editor**, and run `supabase/migrations/001_cms.sql`.
2. Copy `.env.example` to `.env.local` and fill in the values from Supabase **Project Settings → API**. Keep `SUPABASE_SECRET_KEY`, the password hash, and the session secret server-only.
3. Optionally copy the currently published CMS data and uploaded media by running `npm run migrate:cms`.
4. Import the repository into Vercel and add every variable from `.env.example` under **Project Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Deploy, open `/admin`, sign in, and publish once to confirm database and Storage access.

The public site and chatbot read the `cms_entries` table. Admin publishing writes to that table, login throttling uses `login_attempts`, and image uploads go to the public `cms-media` Storage bucket.
