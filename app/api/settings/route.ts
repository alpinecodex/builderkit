import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { kv } from "@vercel/kv";

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

    await kv.hset(email, {
      wordpressPassword: updatedRecord?.wordpressPassword,
      wordpressUrl: updatedRecord?.wordpressUrl,
      wordpressUsername: updatedRecord?.wordpressUsername,
      openAiKey: updatedRecord?.openAiKey,
      anthropicKey: updatedRecord?.anthropicKey,
      copyLeaksKey: updatedRecord?.copyLeaksKey,
      gptModel: updatedRecord?.gptModel,
      serpApiKey: updatedRecord?.serpApiKey,
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
