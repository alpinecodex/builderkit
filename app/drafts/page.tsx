import Menu from "../menu";
import Nav from "../navigation";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session) {
    redirect("/login");
  }

  const email = session?.user?.email;
  const data = await prisma.draft.findMany({
    where: {
      user: {
        email,
      },
    },
  });

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="absolute right-0 top-0 flex min-h-screen w-3/4 justify-center border-neutral-200 sm:mb-[calc(20vh)]">
          <div>
            {data.map((record) => (
              <div key={record.id}>
                <Link href={`/drafts/${record?.id}`}>{record.title}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Menu />
    </>
  );
}
