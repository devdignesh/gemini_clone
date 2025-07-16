import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  createdAt: string;
  image?: string;
}

interface MessageState {
  activeChatroomId: string | null;
  messages: Record<string, Message[]>;
  setActiveChatroom: (id: string) => void;
  addMessage: (chatId: string, msg: Message) => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      activeChatroomId: null,
      messages: {},
      setActiveChatroom: (id) => set({ activeChatroomId: id }),
      addMessage: (chatId, msg) => {
        const current = get().messages[chatId] || [];
        set({ messages: { ...get().messages, [chatId]: [...current, msg] } });
      },
    }),
    { name: 'chat-messages-store' }
  )
);