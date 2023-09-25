import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import * as cheerio from "cheerio";

// data.related_questions.forEach(question => question?.question) => this will add it to whatever. question?.snippet will get the answer for each one

// data.organic_results.forEach(result => result?.link) => link to each top organic result

// https://serpapi.com/search.json?engine=google&q=QUERY

export async function POST(request: Request) {
  const { url } = await request.json();
  getWebsiteContent(url);
  return NextResponse.json("success");
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
