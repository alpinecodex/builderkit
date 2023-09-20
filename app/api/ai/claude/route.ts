import { AnthropicStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const email = request.headers.get("email");
  const apiKey: string = await kv.hget(email, "anthropicKey");
  const { prompt } = await request.json();
  console.log(prompt);

  if (!apiKey) {
    return NextResponse.json(
      "Missing OpenAI API key – make sure to add it in settings.",
      {
        status: 400,
      },
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        prompt: `Human: ${prompt}\n\nAssistant:`,
        model: "claude-2",
        max_tokens_to_sample: 100000,
        temperature: 0.9,
        stream: true,
      }),
    });

    const stream = AnthropicStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return NextResponse.json("An error occured. Please try again later.", {
      status: 500,
    });
  }
}
