import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const { content }: { content: string } = await request.json();

  if (!session) return NextResponse.json("Not authorized", { status: 401 });

  try {
    const { data } = await generateContentScore(content);
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

const generateContentScore = async (content: string) => {
  const response = await fetch(
    "https://api.gowinston.ai/functions/v1/predict",
    {
      method: "POST",
      body: JSON.stringify({
        api_key: process.env.WINSTON_API_KEY,
        text: content,
        sentences: true,
        language: "en",
      }),
      headers: {
        Authorization: `Bearer ${process.env.WINSTON_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  return { data };
};
