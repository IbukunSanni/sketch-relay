"use client";

import { useRouter } from "next/navigation";

import NameForm from "@/components/name-form";
import { api, type Room } from "@/lib/api";

// The host names themselves and gets a room; the API seats them first.
export default function CreateRoom() {
  const router = useRouter();

  async function create(name: string) {
    const room = await api<Room>("/rooms", { name });
    router.push(`/room/${room.code}`);
  }

  return <NameForm button="Create room" onSubmit={create} />;
}
