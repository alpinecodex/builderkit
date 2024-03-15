"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export default function SignOut() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Button variant="outline" size="icon" onClick={() => signOut()}>
      <span className="sr-only">Log Out</span>
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
