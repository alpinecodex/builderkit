import Editor from "@/ui/editor";
import Menu from "./menu";
import Nav from "./navigation";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  return (
    <>
      <div className="flex">
        <Nav />
        <Editor />
      </div>
      <Menu />
    </>
  );
}
