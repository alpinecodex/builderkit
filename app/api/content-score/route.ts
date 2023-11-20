export const maxDuration = 60;

import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const email = session?.user?.email as string | undefined;

  if (!session) return NextResponse.json("Not authorized", { status: 401 });
  const { content }: { content: string } = await request.json();

  try {
    const apiToken: string = await kv.hget(email, "winstonAiToken");
    const { data } = await generateContentScore(content, apiToken);
    console.log("data: ", data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

const generateContentScore = async (content: string, apiToken: string) => {
  console.log(apiToken);
  const response = await fetch(
    "https://api.gowinston.ai/functions/v1/predict",
    {
      method: "POST",
      body: JSON.stringify({
        language: "en",
        sentences: true,
        text: content,
      }),
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  return { data };
};
