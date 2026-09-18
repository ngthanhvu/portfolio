# Portfolio

Personal portfolio & blog built with [Nuxt](https://nuxt.com/).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 |
| UI | Vue 3, Tailwind CSS v4 |
| State | Pinia |
| Database | MySQL 8 via Drizzle ORM |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Editor | TipTap rich-text editor |
| Icons | Nuxt Icon (Lucide) |
| Sitemap | `@nuxtjs/sitemap` |
| Dev/Prod | Docker Compose |

## Features

- **Blog** — Markdown-style posts with tags, rich-text editing (TipTap), hero section
- **Projects** — Portfolio project showcase
- **Comments** — Nested comment threads with likes/dislikes, share, author replies
- **Admin panel** — CRUD for posts, projects, users, comments; settings
- **Auth** — JWT-based login/register with rate limiting
- **Sitemap** — Auto-generated `sitemap.xml` including dynamic blog routes
- **Profile** — Configurable profile (avatar, name, bio, social links)

## Project Structure

```
├── app/
│   ├── components/      # Vue components (blog, comments, admin, ui)
│   ├── composables/     # usePosts, useProjects, useProfile, usePagination
│   ├── pages/
│   │   ├── index.vue          # Homepage
│   │   ├── about.vue          # About page
│   │   ├── posts.vue          # All posts
│   │   ├── projects.vue       # All projects
│   │   ├── blog/[slug].vue    # Single post
│   │   └── admin/             # Admin dashboard
│   ├── types/           # TypeScript type definitions
│   └── assets/          # CSS
├── server/
│   ├── api/
│   │   ├── auth/        # login, register, me, logout
│   │   ├── posts/       # CRUD + slug lookup
│   │   ├── projects/    # CRUD
│   │   ├── comments/    # CRUD + voting
│   │   ├── profile/     # Read/update profile
│   │   └── users/       # Admin user management
│   ├── db/
│   │   ├── schema.ts    # Drizzle schema
│   │   └── seed.ts      # Seed script
│   └── utils/           # auth, db, sanitize
├── docker-compose.yml        # Dev environment
├── docker-compose.prod.yml   # Production deployment
├── Dockerfile                # Dev image
├── Dockerfile.prod           # Production image
└── nuxt.config.ts
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Or Node.js 22+ with MySQL 8

### With Docker (recommended)

```bash
# Copy environment file and edit as needed
cp .env.example .env

# Start all services
docker compose up -d
```

This starts three services:
- **portfolio** — Nuxt dev server on `http://localhost:3000`
- **db** — MySQL 8 on `localhost:3306`
- **drizzle-studio** — Drizzle Studio on `http://localhost:4983`

### Without Docker

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your MySQL connection string

# Push database schema
npm run db:push

# (Optional) Seed sample data
npm run db:seed

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://portfolio:portfolio@localhost:3306/portfolio` |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `DRIZZLE_STUDIO_MASTERPASS` | Drizzle Studio password | `admin` |
| `NUXT_SITEMAP_SITE_URL` | Base URL for sitemap generation | `https://ngthanhvu.com` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:push` | Push schema directly to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with sample data |

## Production Deployment

```bash
# Build and start with production config
docker compose -f docker-compose.prod.yml up -d --build
```

Production setup:
- Portfolio listens on `127.0.0.1:3000` (not exposed to internet directly)
- MySQL runs in a separate container with persistent volume
- No dev tooling or hot-reload overhead

## Authentication

JWT-based auth with HTTP-only cookies. Rate limiting is applied:
- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per hour

Default admin credentials are created via the seed script.

## License

All rights reserved.