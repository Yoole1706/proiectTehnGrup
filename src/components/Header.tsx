"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/auth");
  }

  
  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6 lg:px-8">
      <span className="text-base font-semibold tracking-tight text-zinc-100">
        Notely
      </span>
      <button
        onClick={handleSignOut}
        className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 min-h-[44px]"
      >
        Sign Out
      </button>
    </header>
  );
}
