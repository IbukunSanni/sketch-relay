import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found | Sketch Relay",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium tracking-widest text-zinc-500">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">
        This page got lost along the chain
      </h1>
      <p className="max-w-sm text-lg text-zinc-600 dark:text-zinc-400">
        Somewhere between the prompt and the drawing, it turned into something
        else.
      </p>
      <Link
        href="/"
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to the start
      </Link>
    </main>
  );
}
