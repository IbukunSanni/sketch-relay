import secrets
from typing import Annotated

from fastapi import APIRouter, HTTPException
from postgrest.exceptions import APIError
from pydantic import BaseModel, StringConstraints

from auth import UserId
from db import supabase

router = APIRouter(prefix="/rooms", tags=["rooms"])

# No I or O, so nobody types 1 or 0. 24 letters, 4 of them: 331,776 codes.
CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"
CODE_LENGTH = 4

# Postgres's error code when an insert breaks a unique constraint.
UNIQUE_VIOLATION = "23505"

# A clash needs another request to win the same code or seat in the same
# moment, so a few tries is plenty; past that, something else is wrong.
TRIES = 5

Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=20)]


class NameIn(BaseModel):
    name: Name


class Seat(BaseModel):
    name: str
    seat: int


class RoomOut(BaseModel):
    code: str
    # The asking player's seat, or None if they haven't joined.
    me: Seat | None


def insert_room(host_user_id: str) -> dict:
    """A new room with a random free code."""
    for _ in range(TRIES):
        code = "".join(secrets.choice(CODE_LETTERS) for _ in range(CODE_LENGTH))
        try:
            return (
                supabase()
                .table("rooms")
                .insert({"code": code, "host_user_id": host_user_id})
                .execute()
                .data[0]
            )
        except APIError as error:
            if error.code != UNIQUE_VIOLATION:
                raise
    raise HTTPException(status_code=503, detail="No free room code, try again")


def find_room(code: str) -> dict:
    rows = supabase().table("rooms").select("id, code").eq("code", code.upper()).execute().data
    if not rows:
        raise HTTPException(status_code=404, detail="No room with that code")
    return rows[0]


def seat_of(room_id: str, user_id: str) -> Seat | None:
    rows = (
        supabase()
        .table("players")
        .select("name, seat")
        .eq("room_id", room_id)
        .eq("user_id", user_id)
        .execute()
        .data
    )
    return Seat(**rows[0]) if rows else None


def take_seat(room_id: str, user_id: str, name: str) -> Seat:
    """Seats the player one past the highest seat taken. A player already in
    the room keeps the seat and name they have."""
    for _ in range(TRIES):
        mine = seat_of(room_id, user_id)
        if mine:
            return mine
        top = (
            supabase()
            .table("players")
            .select("seat")
            .eq("room_id", room_id)
            .order("seat", desc=True)
            .limit(1)
            .execute()
            .data
        )
        seat = top[0]["seat"] + 1 if top else 0
        try:
            supabase().table("players").insert(
                {"room_id": room_id, "user_id": user_id, "name": name, "seat": seat}
            ).execute()
            return Seat(name=name, seat=seat)
        except APIError as error:
            # Someone took this seat first, or this player joined twice at
            # once; the next pass sees which.
            if error.code != UNIQUE_VIOLATION:
                raise
    raise HTTPException(status_code=503, detail="The room is busy, try again")


@router.post("")
def create_room(body: NameIn, user_id: UserId) -> RoomOut:
    """Creates a room and seats its host first."""
    room = insert_room(user_id)
    return RoomOut(code=room["code"], me=take_seat(room["id"], user_id, body.name))


@router.get("/{code}")
def get_room(code: str, user_id: UserId) -> RoomOut:
    room = find_room(code)
    return RoomOut(code=room["code"], me=seat_of(room["id"], user_id))


@router.post("/{code}/join")
def join_room(code: str, body: NameIn, user_id: UserId) -> RoomOut:
    """Seats the player; joining again changes nothing."""
    room = find_room(code)
    return RoomOut(code=room["code"], me=take_seat(room["id"], user_id, body.name))
