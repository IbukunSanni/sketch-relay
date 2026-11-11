"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import type { Seat } from "@/lib/api";
import { getSession, supabase } from "@/lib/supabase";

// Who is in the lobby right now. Every seated browser joins the room's
// Realtime channel and announces its name and seat; the list is whoever is
// still connected, so a closed tab drops off by itself. The seats themselves
// live in the database, written only by the API.
export default function WhoIsHere({ code, me }: { code: string; me: Seat }) {
  const [here, setHere] = useState<Seat[]>([]);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    // Set on cleanup. React runs this effect twice in development; the first
    // run must not open a channel once its cleanup has already happened.
    let cancelled = false;

    getSession().then((session) => {
      if (cancelled) return;
      const room = supabase.channel(`room:${code}`, {
        // Keyed by user id: the same player in two tabs counts once.
        config: { presence: { key: session.user.id } },
      });
      room
        .on("presence", { event: "sync" }, () => {
          const seats = Object.values(room.presenceState<Seat>()).map(([first]) => ({
            name: first.name,
            seat: first.seat,
          }));
          setHere(seats.sort((a, b) => a.seat - b.seat));
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") room.track({ name: me.name, seat: me.seat });
        });
      channel = room;
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [code, me.name, me.seat]);

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm text-zinc-500">Here now: {here.length}</p>
      <ul className="flex flex-col gap-1">
        {here.map((player) => (
          <li key={player.seat}>
            {player.seat + 1}. {player.name}
            {player.seat === me.seat && <span className="text-zinc-500"> (you)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
