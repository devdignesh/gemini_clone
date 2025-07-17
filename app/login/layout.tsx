import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="h-screen m-auto w-full flex justify-center items-center">{children}</div>;
};

export default Layout;
