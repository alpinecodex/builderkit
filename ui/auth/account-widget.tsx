import Link from "next/link";
import Image from "next/image";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOut from "./sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/ui/dropdown-menu";

export default async function AccountWidget() {
  const session = (await getServerSession(authOptions)) as Session;

  return (
    <div className="flex items-center justify-between border-b py-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8">
          <div className="inline-flex items-center gap-4 py-2 pr-2">
            <Avatar>
              <AvatarImage src={session.user?.image || undefined} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-left text-xs">{session?.user?.name}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-xs">
            {session.user?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
          <SignOut>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </SignOut>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
