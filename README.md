# VibeCheck

Test your creative intent before you publish.

VibeCheck is a creative-intelligence website that helps digital creators evaluate whether their visuals communicate the vibe they intended. Upload an image, describe the vibe you're going for, and get a structured report: alignment score, perceived vibe, six audience-persona reactions, three perception insights, three improvement suggestions, and three trend-aware recommendations.

This is a real Next.js website with proper authentication, a SQLite database for local development, server-side AI analysis via OpenAI, and a polished dashboard-style frontend. It is not a chatbot.

---

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + custom dark design system
- **NextAuth v5 (Auth.js)** with Credentials provider, JWT sessions, bcrypt password hashing
- **Prisma** + **SQLite** for local development
- **OpenAI** GPT-4o vision API (server-side only)
- **Zod** for validation everywhere — forms, API inputs, AI output
- **Lucide React** for icons
- Swappable storage abstraction (local filesystem out of the box; designed for trivial S3/Cloudinary swap)

---

## Project structure

```
vibecheck/
├── app/
│   ├── (marketing)/page.tsx           # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/                         # Authenticated app shell
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/new/page.tsx
│   │   ├── projects/[id]/page.tsx     # Results page
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── signup/route.ts
│   │   ├── upload/route.ts
│   │   ├── projects/route.ts
│   │   └── projects/[id]/analyze/route.ts
│   ├── uploads/[...path]/route.ts     # Auth-scoped file server
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/                            # Button, Input, Card, Label, Textarea, Badge
│   ├── nav/                           # Marketing + app navs
│   ├── landing/                       # Hero, Features, HowItWorks, CTA, Footer
│   ├── projects/                      # NewProjectForm, UploadCard, ProjectCard, ...
│   ├── analysis/                      # ScoreRing, InsightCard, PersonaCard, AnalysisReport
│   ├── auth/                          # SignOutButton
│   └── providers/                     # SessionProvider wrapper
├── lib/
│   ├── auth/                          # NextAuth config, password hashing, session helpers
│   ├── db/prisma.ts
│   ├── validations/                   # Zod schemas (auth, project, analysis)
│   ├── openai/                        # Client + prompts
│   ├── analysis/service.ts            # Orchestrates the analysis pipeline
│   ├── uploads/                       # StorageProvider interface + LocalStorageProvider
│   └── utils/cn.ts
├── prisma/schema.prisma
├── middleware.ts
├── types/index.ts
├── uploads/                           # Local storage (gitignored)
└── .env.example
```

---

## Prerequisites

- **Node.js 20+** (Next 15 + React RC)
- An **OpenAI API key** with access to `gpt-4o`

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

This will run `prisma generate` automatically as a postinstall step.

### 2. Configure environment

Copy the example env file and fill in real values:

```bash
cp .env.example .env
```

Then set:

```bash
# SQLite database file
DATABASE_URL="file:./prisma/dev.db"

# Generate a strong secret:  openssl rand -base64 32
AUTH_SECRET="..."
AUTH_URL="http://localhost:3000"

OPENAI_API_KEY="sk-..."

STORAGE_PROVIDER="local"
LOCAL_UPLOAD_DIR="./uploads"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Create the local database

```bash
npm run db:push
```

This creates the local SQLite database and the `User`, `Project`, `MediaAsset`, and `AnalysisResult` tables.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and create your first project.

---

## How the analysis pipeline works

1. The user fills out the new-project form and uploads an image (and optionally video/audio).
2. Each file `POST`s to `/api/upload`, which validates type and size, saves it via the `StorageProvider`, and returns a reference (`filePath`, `fileUrl`, `fileName`, `mimeType`, `sizeBytes`).
3. The form then `POST`s to `/api/projects` with the project metadata + media references. A `Project` row and its `MediaAsset` rows are created atomically.
4. The form `POST`s to `/api/projects/[id]/analyze`. The server:
   - Loads the project and its primary `IMAGE` asset
   - Reads the bytes back via the storage provider
   - Base64-encodes the image into a data URL
   - Calls OpenAI `chat.completions.create` with `model: gpt-4o`, `response_format: { type: "json_object" }`, the system prompt, the templated user prompt, and the image
   - Parses the JSON, runs it through `vibeAnalysisSchema` (which enforces all six personas, exact array lengths, score range, and strict keys)
   - Persists the validated result as an `AnalysisResult` row
5. The user is redirected to `/projects/[id]`, which renders the report.

If the model returns malformed JSON or the wrong shape, validation fails cleanly and the user sees a polished error — never a stack trace.

---

## Authentication

- NextAuth v5 with the **Credentials** provider
- Passwords hashed with **bcryptjs** (12 rounds)
- **JWT** session strategy — no DB session table needed
- App routes (`/dashboard`, `/projects/*`, `/settings`) are protected via `middleware.ts` and re-checked server-side in each layout
- `/uploads/[...path]` is auth-scoped: paths begin with `users/<userId>/`, and the route returns 403 if anyone else requests them

---

## Storage

The default `LocalStorageProvider` writes files under `./uploads/users/<userId>/`. To swap to S3 or Cloudinary later, implement the `StorageProvider` interface in `lib/uploads/storage.ts`:

```ts
export interface StorageProvider {
  save(input: SaveFileInput): Promise<SavedFile>;
  readBuffer(filePath: string): Promise<Buffer>;
  delete?(filePath: string): Promise<void>;
}
```

Then add the new provider class to the factory in `getStorage()` keyed off `STORAGE_PROVIDER`.

---

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start the dev server                     |
| `npm run build`      | Production build (runs `prisma generate`)|
| `npm run start`      | Start the production server              |
| `npm run lint`       | Run ESLint                               |
| `npm run db:push`    | Sync Prisma schema to the database       |
| `npm run db:studio`  | Open Prisma Studio                       |
| `npm run db:generate`| Regenerate Prisma client                 |

---

## Deploying to Vercel

1. For production, use a persistent database provider and update the Prisma datasource provider and `DATABASE_URL` together. This checked-in version is configured for SQLite local development.
2. In your Vercel project, set the env vars from `.env.example`. Set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your deployed URL.
3. Run `npx prisma db push` against the production database once.
4. Push to your connected branch.

> **Note about local storage in production.** Vercel's filesystem is ephemeral, so the bundled `LocalStorageProvider` will lose uploads between deploys. For real production usage, implement an S3 or Cloudinary provider before deploying.

---

## Roadmap

- Video analysis pipeline
- Audio mood interpretation
- Account editing in `/settings`
- S3 / Cloudinary storage providers
- Project deletion & history of past analyses per project

---

## License

MIT
