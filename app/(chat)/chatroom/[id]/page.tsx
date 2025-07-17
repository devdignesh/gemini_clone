"use client";
import ChatView from "@/components/ChatView";

type Props = {
  params: { chatroomId: string };
};

export default function ChatroomPage({ params }: Props) {
  const { chatroomId } = params;
  return (
    <div className="flex-1 h-full flex flex-col">
      <ChatView chatId={chatroomId} />
    </div>
  );
}
