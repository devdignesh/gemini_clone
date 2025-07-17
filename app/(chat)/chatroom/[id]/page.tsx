import ChatView from "@/components/ChatView";

const page = async ({ params }: { params: { id: string } }) => {
   const { id } = await params
  return (
    <div className="flex-1 h-full flex flex-col">
      <ChatView chatId={id} />
    </div>
  );
}
export default page;