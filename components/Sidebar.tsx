"use client";
import { useChatStore } from "@/store/chat";
import toast from "react-hot-toast";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Sidebar() {
  const { chatrooms, createChatroom, deleteChatroom } = useChatStore();
  const [search, setSearch] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const activeId = params?.id as string;

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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatroom(id);
    toast.success("Chatroom deleted");
  };

  useEffect(() => {
    setOpen(false);
  }, [activeId]);

  return (
    <>
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border shadow focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setOpen(true)}
        aria-label="Open chat sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          aria-label="Close chat sidebar"
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50 bg-muted/100 border-r shadow-lg p-4 flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:block sm:z-20 sm:bg-muted/40 sm:shadow-none
        `}
        tabIndex={-1}
        aria-label="Chat sidebar"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg select-none">Chatrooms</h2>

          <button
            className="sm:hidden p-1 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setOpen(false)}
            aria-label="Close chat sidebar"
          >
            ×
          </button>
        </div>
        <Input
          placeholder="Search Chatrooms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <Input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="New chatroom title"
            className="flex-1"
          />
          <Button onClick={handleCreate} className="w-full sm:w-auto" size="sm">
            Add
          </Button>
        </div>
        <ul className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.map((room) => (
            <li
              key={room.id}
              className={`group border rounded-md cursor-pointer px-3 py-2 flex justify-between items-center transition-colors select-none
                ${
                  activeId === room.id
                    ? "bg-primary text-primary-foreground border-primary shadow"
                    : "hover:bg-accent hover:text-accent-foreground bg-background border-border"
                }
              `}
              onClick={() => router.push(`/chatroom/${room.id}`)}
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/chatroom/${room.id}`)
              }
            >
              <span className="truncate font-medium text-base">
                {room.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 opacity-70 group-hover:opacity-100"
                onClick={(e) => handleDelete(room.id, e)}
                aria-label={`Delete chatroom ${room.title}`}
                tabIndex={0}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </li>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground px-2">
              No chatrooms found.
            </p>
          )}
        </ul>
      </aside>
    </>
  );
}
