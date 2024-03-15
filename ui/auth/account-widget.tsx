import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOut from "./sign-out";
import { ModeToggle } from "../ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default async function AccountWidget() {
  const session = (await getServerSession(authOptions)) as Session;

  return (
    <div className="grid gap-8">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={session.user?.image || undefined} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground">
            {session?.user?.email?.substring(0, 20) + "..."}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <SignOut />
      </div>
    </div>
  );
}
