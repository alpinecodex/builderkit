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
    const apiKey: string = await kv.hget(email, "winstonAiKey");
    const apiToken: string = await kv.hget(email, "winstonAiToken");
    const { data } = await generateContentScore(content, apiKey, apiToken);
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

const generateContentScore = async (
  content: string,
  apiKey: string,
  apiToken: string,
) => {
  const response = await fetch(
    "https://api.gowinston.ai/functions/v1/predict",
    {
      method: "POST",
      body: JSON.stringify({
        api_key: apiKey,
        text: content,
        sentences: true,
        language: "en",
      }),
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  );
  const data = await response.json();
  return { data };
};
