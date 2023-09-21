import { NextResponse } from 'next/server';
import { kv } from "@vercel/kv";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export const POST = async (req: Request) => {
  const session = (await getServerSession(authOptions)) as Session;
  if (!session) return NextResponse.json("Not authenticated.", { status: 401 });
  const email = session?.user?.email;

  const { content } = await req.json();
  const postData = {
    content: content,
    status: "draft",
    title: content.match(/<h1>(.*?)<\/h1>/)[1],
    slug: content.match(/<h1>(.*?)<\/h1>/)[1],
  };

  const wpUser: string = await kv.hget(email, "wordpressUsername");
  const wpPass: string = await kv.hget(email, "wordpressPassword");
  const wpUrl: string = await kv.hget(email, "wordpressUrl");


  const url = `${wpUrl}/wp-json/wp/v2/posts`;
  const credentials = {
    username: wpUser,
    password: wpPass,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString("base64")}`,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error("Failed to post to WordPress");
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error posting WordPress content" }, { status: 500 });
  }
};
