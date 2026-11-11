import { Suspense } from "react";

import Lobby from "@/components/lobby";

type Params = PageProps<"/room/[code]">["params"];

// The page's shell renders at once. The code is only known per request, so
// the part that reads it waits inside Suspense.
export default function RoomPage({ params }: PageProps<"/room/[code]">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <Suspense fallback={<p className="text-zinc-500">Loading room</p>}>
        <RoomLobby params={params} />
      </Suspense>
    </main>
  );
}

async function RoomLobby({ params }: { params: Params }) {
  const { code } = await params;
  return <Lobby code={code.toUpperCase()} />;
}
