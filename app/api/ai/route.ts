import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "edge";

const models = {
  gpt_4: "gpt-4",
  gpt_4o: "gpt-4o",
  gpt_4o_mini: "gpt-4o-mini",
};

export async function POST(request: Request) {
  const email = request.headers.get("email");
  const apiKey: string = await kv.hget(email, "openAiKey");
  const model: string = await kv.hget(email, "gptModel");
  const { prompt } = await request.json();

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
    const response = await openai.createChatCompletion({
      model: models[model] || "gpt-3.5-turbo-0613",
      stream: true,
      messages: JSON.parse(prompt),
    });

    if (response.status === 401) {
      return new Response(
        "Error: You are unauthorized to perform this action. Check your OpenAI API key in settings.",
        {
          status: 401,
        },
      );
    }

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return NextResponse.json("An error occured. Please try again later.", {
      status: 500,
    });
  }
}
