# Cure Query Bot

Cure Query Bot is a web-based healthcare information chatbot built with React, TypeScript, Vite, and Supabase Edge Functions. It provides educational information about common health topics through a chat interface.

## Features

- Conversational interface with message history and loading states
- Supabase Edge Function integration for generated responses
- Responsive React UI with reusable components
- Toast feedback and a visible health-information disclaimer

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS and shadcn/ui components
- Supabase JavaScript client and Edge Functions
- React Query, React Router, and ESLint

## Run locally

Prerequisites: Node.js 20 LTS or another supported LTS version and npm.

```bash
npm ci
cp .env.example .env
npm run dev
```

On Windows PowerShell, copy the example with:

```powershell
Copy-Item .env.example .env
```

Set the public Supabase project values in `.env`, then start the Vite dev server. Never place a Supabase service-role key, provider API key, or other server secret in a `VITE_*` variable; Vite exposes those values to browser code.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key intended for client-side use with appropriate RLS and function authorization |

The chatbot calls the `healthcare-chat` Supabase Edge Function. Configure provider credentials as server-side Edge Function secrets, not in the frontend.

## Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run lint      # ESLint checks
npm run preview   # preview the built application
```

## CI

GitHub Actions installs dependencies with the committed lockfile, runs ESLint, and creates a production build on pushes to `main` and this improvement branch, and on pull requests to `main`.

## Health and privacy disclaimer

This application is for general educational information only. It is not a substitute for professional medical advice, diagnosis, or treatment. For urgent or severe symptoms, contact local emergency services or a qualified healthcare professional.

Do not submit identifiable personal health information unless the deployment's privacy, access-control, logging, retention, and provider data-handling practices have been reviewed and approved. Never commit secrets or real patient data.
