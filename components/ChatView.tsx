"use client";
import { useEffect, useRef, useState } from "react";
import { Message, useMessageStore } from "@/store/messages";
import { generateFakeReply } from "@/lib/generateFakeReply";
import { MessageBubble } from "./MessageBubble";
import { Button } from "./Button";

export default function ChatView({ chatId }: { chatId: string }) {
  const activeChatroomId = useMessageStore((s) => s.activeChatroomId);
  const allMessages = useMessageStore((s) => s.messages);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (activeChatroomId) {
      const roomMsgs = allMessages[activeChatroomId] || [];
      setChatMessages(roomMsgs);
    }
  }, [activeChatroomId, allMessages]);

  const addMessage = useMessageStore((s) => s.addMessage);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toISOString();
    addMessage(chatId, {
      id: now,
      sender: "user",
      text: input,
      createdAt: now,
    });
    setInput("");

    setTimeout(() => {
      const reply = generateFakeReply();
      addMessage(chatId, {
        id: Date.now().toString(),
        sender: "ai",
        text: reply,
        createdAt: new Date().toISOString(),
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[80vh] p-4 bg-amber-100">
      <div className="flex-1 overflow-y-auto space-y-2">
        {chatMessages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="border p-2 rounded w-full"
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
