const maxDuration = 120;

import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import * as cheerio from "cheerio";
import { getJson } from "serpapi";

// data.related_questions.forEach(question => question?.question) => this will add it to whatever. question?.snippet will get the answer for each one

// data.organic_results.forEach(result => result?.link) => link to each top organic result

export async function POST(request: Request) {
  const { query }: { query: string } = await request.json();

  const params = {
    q: query,
    hl: "en",
    gl: "us",
    google_domain: "google.com",
    safe: "active",
    api_key: process.env.SERP_API_KEY,
  };
  try {
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
