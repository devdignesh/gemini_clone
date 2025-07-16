'use client';
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation"; 
import { Button } from "./Button";

export default function Header() {
  const { phone, isAuthenticated, setAuth, setPhone } = useAuthStore();
  const router = useRouter();

  const logout = () => {
    setAuth(false);
    setPhone("");
    router.push("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b">
      <span className="text-sm">Logged in as: <strong>{phone}</strong></span>
      <Button onClick={logout}>Logout</Button>
    </header>
  );
}