"use client";

import { useEffect, useState } from "react";

import { getSession } from "@/lib/supabase";

// Shows the start of this browser's anonymous user id. The same id after a
// reload means the session survived.
export default function PlayerId() {
  const [text, setText] = useState("signing in");

  useEffect(() => {
    getSession()
      .then((session) => setText(session.user.id.slice(0, 8)))
      .catch(() => setText("sign-in failed"));
  }, []);

  return <p className="text-sm text-zinc-500">You: {text}</p>;
}
