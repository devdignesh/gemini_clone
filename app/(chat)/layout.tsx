
import ChatroomList from "@/components/Sidebar";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ChatroomList />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
