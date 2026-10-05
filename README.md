# EdSecure Hub

EdSecure Hub is a web app for reporting cyber incidents and following up on a report. It includes a public information area for fraud prevention, a citizen-facing reporting and tracking flow, and a separate workspace for authority staff to review and manage complaints.

## What’s in the app

- Public pages for fraud guidance, safety information, and the knowledge library
- Account registration and login
- Complaint submission, evidence upload, and status tracking with a reference ID and PIN
- Authority tools for complaint queues, case details, assignments, status changes, internal notes, and summary statistics
- API routes for authentication, complaints, authority workflows, knowledge articles, safety stations, and health checks

The app is built with Next.js App Router, React, and TypeScript. Its current application data store is a local JSON file at `.data/edsecure_store.json`, initialized with sample records. PostgreSQL schema and seed files, a connection helper, and Docker Compose configuration are also included for database and deployment work. The presence of those files does not mean the current application repository is using PostgreSQL for its data operations. The background job queue currently runs in process and simulates notifications and evidence scanning; it does not send real messages or scan files with an antivirus service.

## Run locally

You’ll need Node.js 22 or later and npm.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

On macOS or Linux, use `cp .env.example .env` in place of `Copy-Item`.

Open [http://localhost:3000](http://localhost:3000) after the development server starts. The local JSON store is created under `.data/` when the app first needs it. Keep `.env` and `.data/` out of source control; `.env.example` is a configuration template, not a set of production credentials.

## Configuration

The app reads these environment variables:

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Secret used to sign authentication sessions. Set a unique, high-entropy value outside local development. |
| `DATABASE_URL` | PostgreSQL connection string used by the database connection helper and connection check. The current app data repository uses the local JSON store. |
| `PORT` | Port for the web server (defaults to Next.js’ usual port when unset). |
| `NATIONAL_HELPLINE` | Helpline number shown by the product. |
| `PLATFORM_BASE_URL` | Public base URL used in deployment configuration. |

`REDIS_URL` appears in the Compose configuration, but the current background queue is in process and does not connect to Redis.

## Useful commands

```bash
npm run dev       # Start the local development server
npm run build     # Build the production app
npm run start     # Serve a production build
npm run lint      # Run ESLint
npm run test      # Run the platform script in scripts/test-platform.ts
npm run db:check  # Check a PostgreSQL connection using DATABASE_URL
```

## Project layout

```text
src/app/       Pages, layouts, and API routes
src/components Shared interface components
src/lib/       Authentication, data access, validation, and queue code
database/      PostgreSQL schema and seed SQL
docs/API.md    API endpoint reference
scripts/       Database and platform utility scripts
```

## Docker

The repository includes `Dockerfile` and Compose configurations. The base `docker-compose.yml` starts the app with PostgreSQL and Redis containers; review its environment values before using it, and replace the development credentials for any deployment. `docker-compose.prod.yml` is an override intended for a configured image and externally supplied secrets:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

For details on request and response shapes, see [docs/API.md](docs/API.md).
