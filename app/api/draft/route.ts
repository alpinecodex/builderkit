import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession, Session } from "next-auth";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const email = session?.user?.email as string | undefined;

  if (!session) return NextResponse.json("Not authorized", { status: 401 });

  const { title, content } = await request.json();

  try {
    const record = await prisma.draft.create({
      data: {
        user: {
          connect: {
            email,
          },
        },
        title,
        content,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.log(error);
    return NextResponse.json("An error occurred.", { status: 500 });
  }
}
