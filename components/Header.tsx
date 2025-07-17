"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

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
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="font-semibold text-lg tracking-tight select-none hidden sm:block">Gemini Clone</span>
        </div>
      
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Logged in as: <strong className="text-foreground">{phone}</strong>
          </span>
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <ModeToggle />
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
