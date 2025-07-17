import { Message } from "@/store/messages";
import { ClipboardCopy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);
  const time = format(new Date(message.createdAt), "p");

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text || "").then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-xs text-sm shadow relative group ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {message.image && (
          <Image
            src={message.image}
            alt="uploaded"
            height={50}
            width={50}
            className="rounded mb-2 max-w-full h-auto"
          />
        )}
        {message.text && <p>{message.text}</p>}
        {message.text && (
          <button
            onClick={handleCopy}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 border border-amber-200 hover:text-black"
            title={copied ? "Copied!" : "Copy"}
          >
            <ClipboardCopy size={16} />
          </button>
        )}
        <p className="text-[10px] text-right text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
