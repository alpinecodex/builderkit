import { NextResponse } from 'next/server';
export const POST = async (req: Request) => {
  const { content } = await req.json();
  console.log(content);
  const postData = {
    content: content,
    status: "draft",
    title: content.match(/<h1>(.*?)<\/h1>/)[1],
    slug: content.match(/<h1>(.*?)<\/h1>/)[1],
  };
  const url = `${process.env.WP_URL}/wp-json/wp/v2/posts`;
  const credentials = {
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASSWORD,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(
      `${credentials.username}:${credentials.password}`
    ).toString("base64")}`,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error("Failed to post to WordPress");
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error posting WordPress content" }, { status: 500 });
  }
};
