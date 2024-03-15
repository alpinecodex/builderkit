import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOut from "./sign-out";

export default async function AccountWidget() {
  const session = (await getServerSession(authOptions)) as Session;

  return (
    <div className="flex w-full justify-between">
      <div className="grid">
        <p className="text-sm">{session?.user?.name}</p>
        <p className="text-xs">
          {session?.user?.email?.substring(0, 20) + "..."}
        </p>
      </div>
      <SignOut />
    </div>
  );
}
