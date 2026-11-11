import { createClient, type Session } from "@supabase/supabase-js";

// The browser's one Supabase client. The publishable key is public by
// design: row-level security decides what it can read, and every write goes
// through the API.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

let signingIn: Promise<Session> | null = null;

// This browser's session, signing in anonymously the first time. The client
// keeps the session in localStorage, so a reload keeps the same user.
// Callers share one sign-in: two at once (React runs effects twice in
// development) would otherwise make two anonymous users.
export async function getSession(): Promise<Session> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  signingIn ??= supabase.auth.signInAnonymously().then(({ data, error }) => {
    if (error || !data.session) throw error ?? new Error("No session");
    return data.session;
  });
  return signingIn;
}
