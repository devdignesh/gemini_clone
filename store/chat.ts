import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface Chatroom {
  id: string;
  title: string;
}

interface ChatStore {
  chatrooms: Chatroom[];
  createChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      createChatroom: (title) => {
        const newChat = { id: uuidv4(), title };
        set({ chatrooms: [...get().chatrooms, newChat] });
      },
      deleteChatroom: (id) => {
        set({ chatrooms: get().chatrooms.filter((c) => c.id !== id) });
      },
    }),
    { name: 'chat-store' }
  )
);