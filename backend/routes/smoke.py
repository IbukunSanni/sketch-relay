from fastapi import APIRouter, HTTPException

from db import supabase

router = APIRouter(tags=["smoke"])


# Proves the API can read Supabase: one known row in a throwaway table.
@router.get("/smoke")
def smoke() -> dict[str, str]:
    rows = supabase().table("smoke_test").select("message").eq("id", 1).execute().data
    if not rows:
        raise HTTPException(status_code=404, detail="smoke_test has no row with id 1")
    return {"message": rows[0]["message"]}
