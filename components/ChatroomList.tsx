"use client";
import { useChatStore } from "@/store/chat";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "./Input";
import { Button } from "./Button";
import { useMessageStore } from "@/store/messages";

export default function ChatroomList() {
  const { chatrooms, createChatroom, deleteChatroom } = useChatStore();
  const [search, setSearch] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const { activeChatroomId, setActiveChatroom } = useMessageStore();

  const debouncedSearch = useDebounce(search, 300);
  const filtered = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCreate = () => {
    if (!newRoom.trim()) return;
    createChatroom(newRoom);
    toast.success("Chatroom created");
    setNewRoom("");
  };

  const handleDelete = (id: string) => {
    deleteChatroom(id);
    toast.success("Chatroom deleted");
  };

  return (
    <div className="space-y-4">
      <Input
        label="Search Chatrooms"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          placeholder="New chatroom title"
          className="border p-2 rounded w-full"
        />
        <Button onClick={handleCreate}>Add</Button>
      </div>

      <ul className="space-y-2">
        {filtered.map((room) => (
          <li
            key={room.id}
            className={`border rounded cursor-pointer p-3 flex justify-between items-center ${
              activeChatroomId === room.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveChatroom(room.id)}
          >
            <span>{room.title}</span>
            <button
              onClick={() => handleDelete(room.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}

        {filtered.length === 0 && <p>No chatrooms found.</p>}
      </ul>
    </div>
  );
}
