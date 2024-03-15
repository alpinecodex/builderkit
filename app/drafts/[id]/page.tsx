import { prisma } from "@/lib/prisma";
import Editor from "@/ui/draft-editor";

export default async function Page({ params: { id }, params: { id: string } }) {
  const draft = await prisma.draft.findUnique({
    where: {
      id,
    },
  });

  return <Editor content={draft?.content} id={id} />;
}
