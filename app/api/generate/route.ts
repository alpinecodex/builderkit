import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const email = req.headers.get("email");
  const apiKey: string = await kv.hget(email, "openAiKey");
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!apiKey) {
    return NextResponse.json(
      "Missing OpenAI API key – make sure to add it in settings.",
      {
        status: 400,
      },
    );
  }

  try {
    const config = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(config);

    let { prompt } = await req.json();

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI writing assistant that continues existing text based on context from prior text. " +
            "Give more weight/priority to the later characters than the beginning ones. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
          // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
          // "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });

    // If the response is unauthorized, return a 401 error
    if (response.status === 401) {
      return new Response(
        "Error: You are unauthorized to perform this action. Check your OpenAI API key in settings.",
        {
          status: 401,
        },
      );
    }
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json("An error occurred. Please try again later.", {
      status: 500,
    });
  }
}
