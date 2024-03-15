import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { File } from "lucide-react";
import DeleteDraft from "@/ui/draft/delete-draft";
import EditDraft from "@/ui/draft/edit-draft";

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
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <section className="mx-4 h-auto max-w-2xl py-24 sm:mx-auto">
      <h1 className="mb-6 text-3xl">Drafts</h1>
      {data.map((record) => (
        <div
          className="mb-2 flex items-center justify-between gap-2"
          key={record.id}
        >
          <File />
          <a
            className="flex w-full items-center justify-between rounded-md border-b p-2 font-light transition-all hover:bg-accent hover:text-muted-foreground"
            href={`/drafts/${record?.id}`}
          >
            <h3 className="flex items-center gap-2 text-lg">{record.title}</h3>
            {/* <p>created: {record.createdAt.toDateString()}</p> */}
            <p className="text-xs text-muted-foreground">
              updated: {record.updatedAt.toDateString()}
            </p>
          </a>
          <EditDraft id={record?.id} title={record?.title} />
          <DeleteDraft id={record?.id} />
        </div>
      ))}
    </section>
  );
}
