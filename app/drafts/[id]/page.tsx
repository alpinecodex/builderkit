import Menu from "@/app/menu";
import Nav from "@/app/navigation";
import { prisma } from "@/lib/prisma";
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
