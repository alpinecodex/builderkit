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

export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  if (!session) return NextResponse.json("Not authenticated.", { status: 401 });
  const { id, content, title } = await request.json();
  if (title) {
    try {
      const updatedRecord = await prisma.draft.update({
        where: {
          id,
        },
        data: {
          title,
        },
      });

      return NextResponse.json(updatedRecord);
    } catch (error) {
      console.log(error);
      return NextResponse.json(error, { status: 500 });
    }
  } else {
    try {
      const updatedRecord = await prisma.draft.update({
        where: {
          id,
        },
        data: {
          content,
        },
      });

      return NextResponse.json(updatedRecord);
    } catch (error) {
      console.log(error);
      return NextResponse.json(error, { status: 500 });
    }
  }
}

export async function DELETE(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  if (!session) return NextResponse.json("Not authenticated.", { status: 401 });
  const { id }: { id: string } = await request.json();
  try {
    const deletedRecord = await prisma.draft.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedRecord);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failed to delete.", { status: 500 });
  }
}
