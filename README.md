# Coral Thread

A full-stack social platform for threaded conversations, built with Next.js 16 and React 19. Users can post threads with text and images, reply to conversations, like and repost content, follow other users, and participate in communities.

## Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19, TypeScript 5.7  |
| Styling        | Tailwind CSS 4, shadcn/ui, Radix Primitives        |
| Authentication | Clerk v6 (email/password, Google OAuth)            |
| Database       | MongoDB with Mongoose 8                            |
| File Uploads   | UploadThing v7                                     |
| State          | Redux Toolkit 2, React-Redux 9                     |
| Forms          | React Hook Form, Zod                               |
| Code Quality   | ESLint 9, Prettier, Husky, lint-staged, commitlint |

## Features

- **Threads** — Create, edit, and delete threads with optional image attachments (up to 4 MB)
- **Conversations** — Nested replies with threaded comment views
- **Engagement** — Like, repost, and follow other users with real-time activity tracking
- **Communities** — Clerk Organizations-backed communities with member management, synced via webhooks
- **Search** — Debounced search across users and communities
- **Activity Feed** — Chronological feed of likes, replies, and reposts on your content
- **Profiles** — Customizable profiles with bio, avatar, and thread/reply tabs
- **Theming** — Light and dark mode with an optional eye comfort filter
- **Auth** — Email/password sign-up with verification, Google OAuth, and protected routes via Clerk middleware

## Prerequisites

- Node.js 20.9+
- MongoDB instance (local or Atlas)
- [Clerk](https://clerk.com) account
- [UploadThing](https://uploadthing.com) account

## Getting Started

```bash
git clone <repository-url>
cd coral-thread
npm install
```

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

MONGODB_URL=

UPLOADTHING_TOKEN=

NEXT_CLERK_WEBHOOK_SECRET=
```

Start the development server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) and redirects to `/home`.

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start development server         |
| `npm run build`        | Create production build          |
| `npm run start`        | Start production server          |
| `npm run lint`         | Run ESLint                       |
| `npm run lint:fix`     | Run ESLint with auto-fix         |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck`    | Run TypeScript type checking     |

## Git Hooks

Commits are enforced with [Conventional Commits](https://www.conventionalcommits.org/) via commitlint. Pre-commit runs lint-staged (ESLint + Prettier on staged files). Pre-push runs `tsc --noEmit`.

## Project Structure

```
app/
  (auth)/          Auth pages (sign-in, sign-up, onboarding)
  (root)/          Main app pages (home, search, communities, activity, profile)
  api/             API routes (UploadThing, Clerk webhooks)
components/
  cards/           Thread, user, and community cards
  forms/           Auth forms, thread creation, profile editing
  shared/          Topbar, Bottombar, search input, tabs
  ui/              shadcn/ui primitives
lib/
  actions/         Server actions (threads, users, communities)
  models/          Mongoose schemas
  validations/     Zod schemas
context/           Redux store and providers
constants/         Navigation and tab definitions
```

## License

All rights reserved.
