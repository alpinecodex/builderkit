import Menu from "@/app/menu";
import Nav from "@/app/navigation";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Editor from "@/ui/draft-editor";

export default async function Page({ params: { id }, params: { id: string } }) {
  const draft = await prisma.draft.findUnique({
    where: {
      id,
    },
  });

  return (
    <>
      <div className="flex">
        <Nav />
        <Editor content={draft?.content} id={id} />
      </div>
      <Menu />
    </>
  );
}
