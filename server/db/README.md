# Database

This folder contains the Drizzle ORM schema and seed script for the project.

## Stack

- **ORM:** Drizzle ORM
- **Driver:** mysql2
- **Database:** MySQL 8.0

## Prerequisites

Start the Docker services first:

```bash
docker compose up -d
```

This starts:
- `portfolio` (Nuxt dev server)
- `db` (MySQL 8.0)
- `drizzle-studio` (Drizzle Studio Gateway)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Insert sample data into the database |
| `npm run db:studio` | Open Drizzle Studio CLI (not used here; use Docker instead) |
| `npm run db:generate` | Generate a migration |
| `npm run db:migrate` | Run migrations |

## Setup Steps

1. Start all Docker services:

   ```bash
   docker compose up -d
   ```

2. Push the database schema:

   ```bash
   docker compose exec portfolio npm run db:push
   ```

3. Seed sample data:

   ```bash
   docker compose exec portfolio npm run db:seed
   ```

4. Open Drizzle Studio and add the MySQL connection.

## Drizzle Studio Connection

Open [http://localhost:4983](http://localhost:4983).

- **Master password:** `admin`
- **Connection string:**

  ```text
  mysql://portfolio:portfolio@db:3306/portfolio
  ```

Use `db` as the host because Drizzle Studio runs inside Docker.

## MySQL Connection Info

| Field | Value |
|-------|-------|
| Host (from host) | `localhost` |
| Host (from container) | `db` |
| Port | `3306` |
| Database | `portfolio` |
| User | `portfolio` |
| Password | `portfolio` |
| Root password | `root` |

## Project Structure

```
server/db/
├── README.md       # This file
├── schema.ts       # Drizzle ORM schema and relations
└── seed.ts         # Seed script with sample data
```

## Notes

- The `drizzle-kit` binary lives inside the `portfolio` container. Always run `db:*` commands via `docker compose exec portfolio ...`.
- If you add a new dependency (e.g., a new Drizzle feature), rebuild the container image or run `npm install` inside the container.
