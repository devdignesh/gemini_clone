"use client";
import { useEffect, useRef, useState } from "react";
import { Message, useMessageStore } from "@/store/messages";
import { generateFakeReply } from "@/lib/generateFakeReply";
import { MessageBubble } from "./MessageBubble";
import Image from "next/image";
import { groupByDate } from "@/lib/groupByDate";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import Header from "./Header";

const MESSAGES_BATCH_SIZE = 15;

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
      const prevScrollHeight = containerRef.current.scrollHeight;
      loadMoreMessages();

      setTimeout(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      }, 50);
    }
  };

  const send = () => {
    const hasText = input.trim().length > 0;
    const hasImage = !!previewImage;

    if ((!hasText && !hasImage) || !activeChatroomId) return;
    const now = new Date().toISOString();
    const sender: "user" | "ai" = "user";
    const msg = {
      id: now,
      text: input,
      sender,
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
    <div className="flex flex-col h-full">
      <Header />
      <div
        className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-4 bg-background"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div className="max-w-7xl w-full m-auto ">
          {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
            <div key={dateLabel}>
              <div className="flex justify-center mb-2">
                <span className="bg-muted text-xs text-muted-foreground px-3 py-1 rounded-full shadow-sm">
                  {dateLabel}
                </span>
              </div>
              <div className="space-y-2">
                {msgs.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-sm text-gray-500 italic mb-2 pl-2">
              Gemini is typing...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 border-t sm:px-6 max-w-7xl w-full m-auto mb-10 flex items-end rounded-4xl border px-3 py-2  ">
        <button
          type="button"
          onClick={() => document.getElementById("chat-image-input")?.click()}
          className="p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary transition"
          aria-label="Upload image"
        >
          <Paperclip className="w-6 h-6 text-muted-foreground" />
        </button>
        <input
          id="chat-image-input"
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
        <div className="w-full flex flex-col justify-start  sm:px-6">
          {previewImage && (
            <div className="w-full flex justify-start mb-2 ">
              <div className="relative mr-2">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="max-w-[80px] max-h-40 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute -top-2 -right-2 bg-gray-300 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type a message"
            rows={1}
            style={{ minHeight: 40 }}
            className="flex-1 resize-none outline-0 border-0 bg-none shadow-none focus:ring-0 focus:outline-none text-base min-h-0"
          />
        </div>
        <Button
          onClick={send}
          className="h-11 w-11 px-6 rounded-full text-center flex items-center  justify-center font-semibold shadow-md"
        >
          <SendHorizontal className="text-center" />
        </Button>
      </div>
    </div>
  );
}
