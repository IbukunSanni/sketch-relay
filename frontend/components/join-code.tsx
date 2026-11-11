"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// For a code read aloud across the room: type it, go to its lobby.
export default function JoinCode() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function go(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/room/${code}`);
  }

  return (
    <form onSubmit={go} className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
        placeholder="Room code"
        maxLength={4}
        className="w-32 rounded border border-zinc-300 px-3 py-2 text-center font-mono tracking-widest"
      />
      <button
        disabled={code.length !== 4}
        className="rounded border border-zinc-300 px-4 py-2 disabled:opacity-50"
      >
        Join
      </button>
    </form>
  );
}
