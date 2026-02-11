# Coral Thread

A full-stack social media application inspired by Threads, built with Next.js and React.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript 5.7
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Authentication:** Clerk v6
- **Database:** MongoDB with Mongoose 8
- **File Uploads:** UploadThing v7
- **State Management:** Redux Toolkit 2, React-Redux 9
- **Form Handling:** React Hook Form, Zod validation

## Features

- Create, comment on, and like threads
- User authentication and onboarding
- Custom profile with bio, username, and profile picture
- Community creation and management via Clerk organizations
- File/image uploads
- Activity feed
- Search for users and communities
- Responsive design

## Prerequisites

- Node.js 20.9+
- MongoDB instance
- Clerk account
- UploadThing account

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd coral-thread
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in the environment variables in `.env.local`.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/            → Next.js app router pages and API routes
components/     → Reusable UI and feature components
constants/      → App-wide constants
context/        → Redux store, slices, and middleware
lib/            → Server actions, database models, validations, utilities
public/         → Static assets
types/          → TypeScript type definitions
```
