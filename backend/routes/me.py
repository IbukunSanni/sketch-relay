from fastapi import APIRouter

from auth import UserId

router = APIRouter(tags=["players"])


# Proves the API knows who is asking: the user id behind the token.
@router.get("/me")
def me(user_id: UserId) -> dict[str, str]:
    return {"user_id": user_id}
