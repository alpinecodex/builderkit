const maxDuration = 120;

import axios from "axios";
import * as cheerio from "cheerio";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const email = session?.user?.email as string | undefined;

  if (!session) return NextResponse.json("Not authorized", { status: 401 });
  const { organicResults }: { organicResults: string[] } = await request.json();
  console.log("organicResults: ", organicResults);
  const organicResultsHeadlines: string[] = [];
  for (const url of organicResults) {
    try {
      const { content } = await getH2(url);
      organicResultsHeadlines.push(...content);
    } catch (error) {
      console.error(`Error fetching from ${url}: ${error}`);
      continue;
    }
  }
  console.log(organicResultsHeadlines);
  return NextResponse.json(organicResultsHeadlines);
}

const getH2 = async (url: string) => {
  const response = await axios.get(url);
  const body = response.data;

  const $ = cheerio.load(body);

  const content: string[] = [];
  $("h2").each((index, element) => {
    content.push($(element).text().trim());
  });

  return { content };
};
