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
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-1`}
    >
      <div>
        <div
          className={`relative group px-4 py-2 transition-all
          ${
            isUser
              ? "bg-gray-300/50 rounded-b-4xl rounded-tl-4xl"
              : "bg-white text-gray-900 border border-gray-200 rounded-3xl"
          }
          max-w-[80vw] sm:max-w-md break-words flex flex-col`}
        >
          {message.image && (
            <Image
              src={message.image}
              alt="uploaded"
              height={180}
              width={180}
              className="rounded-lg border mb-2 max-w-[200px] max-h-48 object-cover shadow-sm"
            />
          )}
          {message.text && (
            <p className="whitespace-pre-line text-base leading-relaxed">
              {message.text}
            </p>
          )}
          {message.text && (
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 p-1 rounded-full bg-white/80 border border-gray-200 shadow hover:bg-blue-100 focus:bg-blue-100 focus:outline-none transition-opacity
              ${isUser ? "text-blue-700" : "text-gray-600"}
              opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100`}
              title={copied ? "Copied!" : "Copy"}
              aria-label="Copy message"
              tabIndex={0}
            >
              <ClipboardCopy size={18} />
              <span className="sr-only">Copy</span>
            </button>
          )}
        </div>
        <span className={`text-[11px] mt-2  ${isUser ? "text-right pr-3" : "text-left pl-3"} block select-none `}>
          {time}
        </span>
      </div>
    </div>
  );
}
