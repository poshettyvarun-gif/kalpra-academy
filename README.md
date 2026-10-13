# Kalpra Academy

Kalpra Academy is a responsive EdTech website built with Next.js, React and
PostgreSQL. It includes course pages, services, collaborations, testimonials,
contact information, a website assistant and a protected content management
system.

## Main features

- Responsive layouts for desktop, laptop, tablet and mobile devices
- Course catalogue with category filtering and individual course pages
- Services, gallery, collaborations and testimonials
- PostgreSQL-backed CMS at `/admin`
- CMS image uploads stored on the server filesystem
- Protected admin sessions and login rate limiting
- Website chatbot that answers from published website content
- Smooth section navigation and mobile navigation

## Technology

- Next.js 16 and React 19
- TypeScript
- PostgreSQL
- `postgres` JavaScript client
- Tailwind CSS and custom CSS

Supabase is not used by this project.

## Requirements

- Node.js 22
- npm
- PostgreSQL 14 or newer

## Local setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create the PostgreSQL database:

   ```sh
   createdb kalpra_academy
   ```

3. Copy `.env.example` to `.env.local` and configure the values:

   ```dotenv
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/kalpra_academy
   DATABASE_SSL=false
   DATABASE_POOL_SIZE=5
   UPLOAD_DIR=var/uploads
   ADMIN_USERNAME=
   ADMIN_PASSWORD_HASH=
   ADMIN_SESSION_SECRET=
   ```

   Keep `.env.local` private. Never commit passwords, database credentials or
   session secrets.

4. Create the CMS tables:

   ```sh
   npm run db:setup
   ```

5. If content must be copied from an existing deployment:

   ```sh
   SOURCE_SITE_URL=https://example.com npm run db:migrate-content
   ```

6. Verify PostgreSQL and local media storage:

   ```sh
   npm run verify:postgres
   ```

7. Start the development server:

   ```sh
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The CMS is available at
[http://localhost:3000/admin](http://localhost:3000/admin).

## Available commands

```sh
npm run dev                 # Start the development server
npm run build               # Create a production build
npm run start               # Start the production server
npm run lint                # Run the linter
npm run format              # Format the source code
npm run db:setup            # Create/update PostgreSQL CMS tables
npm run db:migrate-content  # Import content from another deployment
npm run verify:postgres     # Verify the database and media directory
```

## CMS data and uploaded images

- Website content is stored in PostgreSQL in `cms_entries`.
- Login-attempt records are stored in `login_attempts`.
- Uploaded images are written beneath `UPLOAD_DIR/cms`.
- The default local upload directory is `var/uploads` and is excluded from Git.
- Back up both PostgreSQL and the upload directory in production.

## Production deployment

The application needs:

- A Node.js 22 runtime
- A reachable PostgreSQL database
- A persistent writable directory for `UPLOAD_DIR`
- All variables from `.env.example` configured as production secrets

Run `npm run db:setup` once against the production database before using the
CMS. A GoDaddy VPS can host the Node.js application, PostgreSQL and persistent
uploads. Standard shared hosting is unsuitable when it does not provide the
required Node.js runtime and PostgreSQL service.

More database and deployment details are available in
[POSTGRES_SETUP.md](./POSTGRES_SETUP.md).

## Verification

Before deployment, run:

```sh
npm run verify:postgres
node --test lib/chatbot.test.mjs
npx tsc --noEmit
npm run build -- --webpack
```

The website has been checked at 1440×900, 1024×768, 768×1024 and 390×844
viewports across the homepage, courses, about, contact, course-detail and admin
pages.
