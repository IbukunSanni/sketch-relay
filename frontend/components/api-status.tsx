"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "up" | "down";

// Runs in the browser, so this request crosses origins and CORS applies.
export default function ApiStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body) => setStatus(body.status === "ok" ? "up" : "down"))
      .catch(() => setStatus("down"));
  }, []);

  return <p className="text-sm text-zinc-500">API: {status}</p>;
}
