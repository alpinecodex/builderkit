import axios from "axios";
import * as cheerio from "cheerio";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const email = session?.user?.email as string | undefined;
  if (!session) return NextResponse.json("Not authorized", { status: 401 });
  const { url } = await request.json();
  const { content } = await getWebsiteContentAndTitle(url);
  return NextResponse.json(content);
}

const getWebsiteContentAndTitle = async (url: string) => {
  try {
    const response = await axios.get(url);
    const body = response.data;

    const $ = cheerio.load(body);

    const articleTag = $("article").first();

    const content = articleTag.text().trim() || null;

    const title = $("title").text().trim() || "article";

    return { content, title };
  } catch (error) {
    throw error;
  }
};
