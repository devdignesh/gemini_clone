'use client';
import { useParams } from 'next/navigation';
import ChatView from '@/components/ChatView';

export default function ChatroomPage() {
  const params = useParams();
  const chatId = params.id as string;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Chatroom</h1>
      <ChatView chatId={chatId} />
    </div>
  );
}
