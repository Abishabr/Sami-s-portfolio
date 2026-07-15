# Portfolio Backend

Express + Prisma + PostgreSQL + JWT + Cloudinary API for the portfolio site.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create a `.env` file** — copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — from your Render PostgreSQL instance
   - `JWT_SECRET` — any long random string
   - `CLOUDINARY_*` — from your free Cloudinary account (cloudinary.com)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your first admin login

3. **Push the schema to your database**
   ```
   npx prisma migrate dev --name init
   ```
   This creates all tables (users, projects, categories, etc.) in your Postgres database.

4. **Seed your admin account and default categories**
   ```
   npm run seed
   ```

5. **Run the server locally**
   ```
   npm run dev
   ```
   Server runs at `http://localhost:5000`. Test it: `http://localhost:5000/api/health`

## Deploying to Render

1. Push this folder to a GitHub repo.
2. On Render: New → Web Service → connect your repo.
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start command: `npm start`
5. Add all the same environment variables from your `.env` in Render's dashboard under "Environment".
6. After first deploy, run `npm run seed` once (Render Shell tab) to create your admin account.

## API Overview

All routes are prefixed with `/api`.

| Resource | Public | Admin (needs `Authorization: Bearer <token>`) |
|---|---|---|
| `/auth` | POST `/login` | POST `/change-password`, GET `/me` |
| `/projects` | GET `/`, GET `/:slug` | POST, PUT `/:id`, DELETE `/:id`, PATCH `/:id/featured`, POST `/featured/reorder` |
| `/categories` | GET `/` | POST, PUT `/:id`, DELETE `/:id` |
| `/services` | GET `/` | POST, PUT `/:id`, DELETE `/:id` |
| `/skills` | GET `/` | POST, PUT `/:id`, DELETE `/:id` |
| `/experiences` | GET `/` | POST, PUT `/:id`, DELETE `/:id` |
| `/messages` | POST `/` (contact form) | GET `/`, PATCH `/:id/read`, DELETE `/:id` |
| `/social-links` | GET `/` | POST (upsert), DELETE `/:id` |
| `/settings` | GET `/` | PUT `/`, PUT `/resume`, GET `/dashboard-stats` |

Login example:
```
POST /api/auth/login
{ "email": "you@example.com", "password": "yourpassword" }
→ { "token": "...", "user": {...} }
```
Use the returned `token` as `Authorization: Bearer <token>` on all admin requests.
