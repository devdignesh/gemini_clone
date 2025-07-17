import ChatView from "@/components/ChatView";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div className="flex-1 h-full flex flex-col">
      <ChatView chatId={id} />
    </div>
  );
}
