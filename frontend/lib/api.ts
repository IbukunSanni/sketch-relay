import { getSession } from "@/lib/supabase";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

// Calls the API as this browser's player: the Supabase token rides in the
// Authorization header, and the API checks it.
export async function api<T>(path: string, body?: unknown): Promise<T> {
  const session = await getSession();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof json.detail === "string" ? json.detail : res.statusText;
    throw new ApiError(res.status, detail);
  }
  return json as T;
}

export type Seat = { name: string; seat: number };
export type Room = { code: string; me: Seat | null };
