"use client";

import { useEffect, useState } from "react";

import NameForm from "@/components/name-form";
import WhoIsHere from "@/components/who-is-here";
import { api, type Room } from "@/lib/api";

// One room's lobby: the code to share, a name form until this player has a
// seat, then who's here. `room` is only set in the browser, after the API
// answers, so `window` is safe to read below it.
export default function Lobby({ code }: { code: string }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Room>(`/rooms/${code}`)
      .then(setRoom)
      .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong"));
  }, [code]);

  async function join(name: string) {
    setRoom(await api<Room>(`/rooms/${code}/join`, { name }));
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!room) return <p className="text-zinc-500">Loading room</p>;

  return (
    <>
      <p className="text-sm text-zinc-500">Room</p>
      <h1 className="font-mono text-5xl font-semibold tracking-widest">{room.code}</h1>
      <p className="text-sm text-zinc-500">
        Invite: {window.location.host}/room/{room.code}
      </p>
      {room.me ? (
        <WhoIsHere code={room.code} me={room.me} />
      ) : (
        <NameForm button="Join" onSubmit={join} />
      )}
    </>
  );
}
