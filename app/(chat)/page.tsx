"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="flex-1 h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-background   rounded-2xl   p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-center">
            No chatroom selected
          </h2>
          <p className="text-muted-foreground text-center">
            Select a chatroom from the sidebar or create a new one to start
            chatting!
          </p>
        </div>
      </div>
    </main>
  );
}
