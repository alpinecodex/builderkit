import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "edge";

const models = {
  gpt_4: "gpt-4",
  gpt_4_0613: "gpt-4-0613",
  gpt_4_32k: "gpt-4-32k",
  gpt_4_32k_0613: "gpt-4-32k-0613",
  gpt_4_0314: "gpt-4-0314",
  gpt_4_32k_0314: "gpt-4-32k-0314",
  gpt_3_5_turbo: "gpt-3.5-turbo",
  gpt_3_5_turbo_16k: "gpt-3.5-turbo-16k",
  gpt_3_5_turbo_instruct: "gpt-3.5-turbo-instruct",
  gpt_3_5_turbo_0613: "gpt-3.5-turbo-0613",
  gpt_3_5_turbo_16k_0613: "gpt-3.5-turbo-16k-0613",
  gpt_3_5_turbo_0301: "gpt-3.5-turbo-0301",
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
