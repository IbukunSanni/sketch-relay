# Sketch Relay

*Working name.* A party drawing game: write a prompt, draw what you're given,
describe what you see, and watch every chain drift at the end.

**Status:** building the MVP. The plan, the architecture and every decision
are in [docs/ENGINEERING.md](docs/ENGINEERING.md).

## Layout

```
sketch-relay/
├── frontend/          Next.js, TypeScript, Tailwind → Vercel
│   ├── app/           routes: one folder per URL (/, /draw, ...)
│   ├── components/    UI pieces used by routes (the canvas)
│   └── public/        static files
├── backend/           FastAPI, Python → Railway (from step 0c)
└── docs/
    └── ENGINEERING.md the plan, the architecture, every decision
```

Each side has its own dependencies, config and `.env`; neither imports from
the other. They talk only over HTTP. Data, live updates and drawings live in
Supabase.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

Keys go in `frontend/.env.local` and `backend/.env`, listed in
[docs/ENGINEERING.md](docs/ENGINEERING.md#architecture). Every `.env` file is
ignored by git; never commit one.

`frontend/AGENTS.md` is written by Next.js itself and points coding agents at the
docs for this version.
