import os
from functools import lru_cache

from supabase import Client, create_client


# Made on first use, not at import, so the app and /health still start when
# the keys are missing; only the routes that need the database fail.
@lru_cache
def supabase() -> Client:
    # The secret key skips row-level security. It stays on the server.
    return create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SECRET_KEY"])
