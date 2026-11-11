from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase_auth.errors import AuthError

from db import supabase

# auto_error=False so a missing token gets the same 401 as a bad one, rather
# than FastAPI's own error.
bearer = HTTPBearer(auto_error=False)


def current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> str:
    """The Supabase user behind the request's token, or a 401."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Sign in first")
    try:
        # Supabase checks the token's signature and expiry: one call to
        # Supabase on every request that needs a user.
        response = supabase().auth.get_user(credentials.credentials)
    except AuthError:
        response = None
    if response is None or response.user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return response.user.id


# A route that takes `user_id: UserId` answers only signed-in players.
UserId = Annotated[str, Depends(current_user_id)]
