"use client";

import { useEffect, useState } from "react";

// Shows the test row the API reads from Supabase, so the whole chain
// (browser → API → database) is visible on the home page.
export default function DbStatus() {
  const [text, setText] = useState("checking");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/smoke`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body: { message: string }) => setText(body.message))
      .catch(() => setText("down"));
  }, []);

  return <p className="text-sm text-zinc-500">Database: {text}</p>;
}
