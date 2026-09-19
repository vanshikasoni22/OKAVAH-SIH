# Charter-IQ

AI freight forecasting and vessel chartering dashboard for SAIL (Ministry of
Steel) — built for Smart India Hackathon 2026, PS26006.

Charter-IQ predicts freight rates, tells you when to book vs. wait, matches
the right vessel to the right port, and shows the reasoning behind every
call — no black box.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router) + Tailwind CSS v4
- React Three Fiber / Three.js for the homepage 3D hero scene
- Framer Motion for scroll-triggered reveals

## Data

Every screen currently runs on realistic hardcoded/mock data, structured so
a real forecasting API can slot in later without restructuring the UI.

## Credits

The hero scene's ship model ("Cruisership 2012") is from
[AbhimanRajCoder/sheep-threejs](https://github.com/AbhimanRajCoder/sheep-threejs),
free to use commercially and non-commercially with credit.

## Deploy

Deploys to [Vercel](https://vercel.com) with zero config — it's a standard
Next.js App Router project, so every route (including `/dashboard`) is a
real server route with no client-side rewrite needed for deep links.
