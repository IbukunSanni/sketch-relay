# Backend

FastAPI, deployed on Railway. The endpoints, the secrets and the decisions
behind them are in [../docs/ENGINEERING.md](../docs/ENGINEERING.md).

## Run it

From `backend/`, once:

```bash
py -3.12 -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
```

Then:

```bash
.venv/Scripts/python -m uvicorn main:app --reload
```

and open http://localhost:8000/health, or http://localhost:8000/docs for every
endpoint. On macOS or Linux create the venv with `python3.12 -m venv .venv`,
and the folder is `.venv/bin`, not `.venv/Scripts`.

Run `pip install -r requirements.txt` again whenever `requirements.txt`
changes.

A new package goes in with pip, then into `requirements.txt` at its exact
version (`pip show <name>` prints it). Railway installs from that file, so
anything missing from it is missing in production.

Secrets go in `backend/.env`, which git ignores.
