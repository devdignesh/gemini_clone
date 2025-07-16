import { Message } from "@/store/messages";
import Image from "next/image";
export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-xs text-sm shadow ${
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
        <div className="text-[10px] mt-1 text-right opacity-50">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
