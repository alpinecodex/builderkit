const maxDuration = 60;

import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import axios from "axios";
import * as cheerio from "cheerio";
import { getJson } from "serpapi";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session;
  const email = session?.user?.email as string | undefined;

  if (!session) return NextResponse.json("Not authorized", { status: 401 });

  const { query }: { query: string } = await request.json();
  try {
    const apiKey: string = await kv.hget(email, "serpApiKey");
    const params = {
      q: query,
      hl: "en",
      gl: "us",
      google_domain: "google.com",
      safe: "active",
      api_key: apiKey,
    };

    const response = await getJson("google", params);
    const relatedQuestions: string[] = response["related_questions"].map(
      (question: { question?: string }) => question?.question,
    );
    const organicResults: string[] = response["organic_results"].map(
      (result: { link?: string }) => result?.link,
    );

    return NextResponse.json({ relatedQuestions, organicResults });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}

const getWebsiteContent = async (url: string) => {
  try {
    const response = await axios.get(url);
    const body = response.data;

    const $ = cheerio.load(body);

    const h2Tags = [];
    $("h2").each((index, element) => {
      h2Tags.push($(element).text().trim());
    });

    console.log(h2Tags);
    return h2Tags;
  } catch (error) {
    throw error;
  }
};
