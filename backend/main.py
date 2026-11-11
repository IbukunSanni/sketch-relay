from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import health, smoke

# Reads backend/.env on this machine. Railway has no .env and sets the same
# variables itself; a variable already set is never overwritten.
load_dotenv()

app = FastAPI(
    title="Sketch Relay API",
    description="The API behind Sketch Relay, a party drawing game.",
    version="0.1.0",
)

# Origins must match exactly: scheme, host and port, no trailing slash.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",  # Next.js dev server
        "http://127.0.0.1:3001",
        "https://www.playsketchrelay.com",  # production front end
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(smoke.router)
