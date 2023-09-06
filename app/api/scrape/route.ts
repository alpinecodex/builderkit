import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
