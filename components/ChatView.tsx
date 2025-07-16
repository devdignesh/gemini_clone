"use client";
import { useEffect, useRef, useState } from "react";
import { Message, useMessageStore } from "@/store/messages";
import { generateFakeReply } from "@/lib/generateFakeReply";
import { MessageBubble } from "./MessageBubble";
import { Button } from "./Button";
import Image from "next/image";

export default function ChatView({ chatId }: { chatId: string }) {
  const activeChatroomId = useMessageStore((s) => s.activeChatroomId);
  const allMessages = useMessageStore((s) => s.messages);
  const addMessage = useMessageStore((s) => s.addMessage);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (activeChatroomId) {
      const roomMsgs = allMessages[activeChatroomId] || [];
      setChatMessages(roomMsgs);
    }
  }, [activeChatroomId, allMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const send = () => {
    if (!input.trim() || !activeChatroomId) return;
    const now = new Date().toISOString();
    const msg = {
      id: now,
      text: input,
      sender: "user",
      createdAt: now,
      image: previewImage || undefined,
    };
    addMessage(chatId, msg);
    setInput("");
    setPreviewImage(null);

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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatroomId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[80vh] p-4 bg-amber-100">
      <div className="flex-1 overflow-y-auto space-y-2">
        {chatMessages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {previewImage && (
        <div className="mb-2">
          <Image
            src={previewImage}
            alt="Preview"
            width={50}
            height={50}
            className="max-w-xs max-h-40 rounded border mb-1"
          />
          <Button
            onClick={() => setPreviewImage(null)}
            className="text-sm bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove Image
          </Button>
        </div>
      )}

      <div className="mt-2 flex gap-2 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="border p-2 rounded"
        />
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
