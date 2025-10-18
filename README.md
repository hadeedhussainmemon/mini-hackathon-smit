React + Express + MongoDB + Tailwind starter for Vercel

This repository is a minimal monorepo scaffold to use React (Vite) for the frontend and Express for API endpoints deployed as serverless functions on Vercel. Tailwind is configured for the client. MongoDB can be connected via the `MONGODB_URI` environment variable.

Quick start (Windows cmd.exe):

1. Install dependencies (run in each folder)
   cd client
   npm install
   cd ..\api
   npm install

2. Run client locally
   cd client
   npm run dev

3. Run api locally (optional — requires Node)
   cd api
   node index.js

4. Deploy with Vercel CLI
   npm i -g vercel
   vercel login
   vercel (follow prompts)    # or vercel --prod to deploy to production

Important: Set `MONGODB_URI` in Vercel Project Settings > Environment Variables before deploying if you use MongoDB.

Files created:
- `client/` — Vite + React + Tailwind app (src, index.html, package.json)
- `api/` — Express app wrapped with `serverless-http` (single file handler `index.js`)
- `vercel.json` — Vercel build settings for monorepo

Notes:
- After installing dependencies, run `npm run build` inside `client` before deploying if you want to test a production build locally (`npm run preview`). Vercel will run the build automatically during deploy.
