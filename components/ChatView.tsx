"use client";
import { useEffect, useRef, useState } from "react";
import { Message, useMessageStore } from "@/store/messages";
import { generateFakeReply } from "@/lib/generateFakeReply";
import { MessageBubble } from "./MessageBubble";
import { Button } from "./Button";
import Image from "next/image";
import { groupByDate } from "@/lib/groupByDate";

const MESSAGES_BATCH_SIZE = 10;

export default function ChatView({ chatId }: { chatId: string }) {
  const activeChatroomId = useMessageStore((s) => s.activeChatroomId);
  const allMessages = useMessageStore((s) => s.messages);
  const addMessage = useMessageStore((s) => s.addMessage);

  const [input, setInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMoreMessages = () => {
    if (!activeChatroomId) return;
    const all = allMessages[activeChatroomId] || [];
    const currentlyLoaded = chatMessages.length;
    const next = all.slice(
      Math.max(0, all.length - currentlyLoaded - MESSAGES_BATCH_SIZE),
      all.length - currentlyLoaded
    );

    if (next.length === 0) {
      setHasMore(false);
      return;
    }

    setChatMessages((prev) => [...next, ...prev]);
  };

  useEffect(() => {
    if (!activeChatroomId) return;
    const all = allMessages[activeChatroomId] || [];
    const initial = all.slice(-MESSAGES_BATCH_SIZE);
    setChatMessages(initial);
    setHasMore(all.length > initial.length);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [activeChatroomId, allMessages]);

  const handleScroll = () => {
    if (!containerRef.current || !hasMore) return;
    if (containerRef.current.scrollTop === 0) {
      loadMoreMessages();
    }
  };

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
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateFakeReply();
      addMessage(chatId, {
        id: Date.now().toString(),
        sender: "ai",
        text: reply,
        createdAt: new Date().toISOString(),
      });
      setIsTyping(false);
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

  const groupedMessages = groupByDate(chatMessages);

  return (
    <div className="flex flex-col h-[80vh] p-4 bg-amber-100">
      <div
        className="flex-1 overflow-y-auto space-y-2"
        onScroll={handleScroll}
        ref={containerRef}
      >
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            <div className="text-center text-xs text-gray-500 my-2">
              {dateLabel}
            </div>
            {msgs.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 italic mb-2">
            Gemini is typing...
          </div>
        )}
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
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message"
          className="border p-2 rounded w-full"
          rows={1}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
