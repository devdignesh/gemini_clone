"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import ChatView from "@/components/ChatView";
import { useMessageStore } from "@/store/messages";
import ChatroomList from "@/components/ChatroomList";

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const { activeChatroomId } = useMessageStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-[calc(100vh-50px)]">
      {/* Sidebar */}
      <aside className="w-[300px] border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Chatrooms</h2>
        <ChatroomList />
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {activeChatroomId ? (
          <ChatView chatId={activeChatroomId} />
          
        ) : (
          <div className="p-4 text-center">No chatroom selected</div>
        )}
      </main>
    </div>
  );
}
