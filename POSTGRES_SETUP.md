# PostgreSQL CMS setup

The website CMS uses a standard PostgreSQL database and server-local media
storage.

## Local setup

1. Start PostgreSQL and create a database:

   ```sh
   createdb kalpra_academy
   ```

2. Add these values to `.env.local`:

   ```dotenv
   DATABASE_URL=postgresql://YOUR_USER@localhost:5432/kalpra_academy
   DATABASE_SSL=false
   DATABASE_POOL_SIZE=5
   UPLOAD_DIR=var/uploads
   ```

3. Create the CMS tables and copy the currently published content:

   ```sh
   npm run db:setup
   SOURCE_SITE_URL=https://kalpra-academy.vercel.app npm run db:migrate-content
   npm run verify:postgres
   ```

4. Start the website with `npm run dev`.

## Production setup

- Set `DATABASE_URL` to the production PostgreSQL connection string.
- Set `DATABASE_SSL=true` when the database provider requires TLS.
- Set `UPLOAD_DIR` to an absolute persistent directory that survives releases,
  such as `/var/lib/kalpra-academy/uploads`.
- Run `npm run db:setup` once, then run `npm run db:migrate-content` while the
  old site is still available.
- Back up both PostgreSQL and `UPLOAD_DIR` regularly.

GoDaddy's managed Node.js Hosting currently includes MySQL. Use this PostgreSQL
configuration on a GoDaddy VPS, or use an external PostgreSQL provider reachable
from the GoDaddy Node.js application.
