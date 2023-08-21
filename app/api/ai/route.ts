import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  organization: process.env.OPENAI_API_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  console.log(prompt);

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: JSON.parse(prompt),
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
