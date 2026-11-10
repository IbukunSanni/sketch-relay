# Sketch Relay

*Working name.* A party drawing game: write a prompt, draw what you're given,
describe what you see, and watch every chain drift at the end.

**Live:** https://www.playsketchrelay.com

**Status:** building the MVP. The plan, the architecture and every decision
are in [docs/ENGINEERING.md](docs/ENGINEERING.md).

## Layout

```
sketch-relay/
├── frontend/          Next.js, TypeScript, Tailwind → Vercel
│   ├── app/           routes: one folder per URL (/, /draw, ...)
│   ├── components/    UI pieces used by routes (the canvas)
│   └── public/        static files
├── backend/           FastAPI, Python → Railway
└── docs/
    └── ENGINEERING.md the plan, the architecture, every decision
```

Each side has its own dependencies, config and `.env`; neither imports from
the other. They talk only over HTTP. Data, live updates and drawings live in
Supabase.

## Run it

Front end:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3001. The port is pinned in `frontend/package.json`
because the API's CORS list allows that origin.

Back end, in a second terminal (Python 3.12):

```bash
cd backend
py -3.12 -m venv .venv                                # once
.venv/Scripts/python -m pip install -r requirements.txt   # once, and after requirements.txt changes
.venv/Scripts/python -m uvicorn main:app --reload
```

Then open http://localhost:8000/health, or http://localhost:8000/docs for
every endpoint. On macOS or Linux use `python3.12 -m venv .venv` and
`.venv/bin` instead of `.venv/Scripts`. More in
[backend/README.md](backend/README.md).

Keys go in `frontend/.env.local` and `backend/.env`, listed in
[docs/ENGINEERING.md](docs/ENGINEERING.md#architecture). Every `.env` file is
ignored by git; never commit one.

`frontend/AGENTS.md` is written by Next.js itself and points coding agents at the
docs for this version.
