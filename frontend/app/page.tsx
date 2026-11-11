import ApiStatus from "@/components/api-status";
import CreateRoom from "@/components/create-room";
import DbStatus from "@/components/db-status";
import JoinCode from "@/components/join-code";
import PlayerId from "@/components/player-id";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Sketch Relay</h1>
      <p className="max-w-sm text-lg text-zinc-600 dark:text-zinc-400">
        Write a prompt, draw what you&apos;re given, describe what you see.
      </p>
      <CreateRoom />
      <JoinCode />
      <ApiStatus />
      <DbStatus />
      <PlayerId />
    </main>
  );
}
