import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const email = session?.user?.email;
  if (!session) return NextResponse.json("Not authenticated.", { status: 400 });
  const data = await request.json();
  const key = Object.keys(data)[0];
  const value = data[Object.keys(data)[0]];

  try {
    const updatedRecord = await prisma.user.update({
      where: {
        email,
      },
      data: {
        [key]: value,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
