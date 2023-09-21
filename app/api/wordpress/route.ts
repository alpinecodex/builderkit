import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const post = req.body;

  const url = `${process.env.WP_URL}/wp-json/wp/v2/posts`;
  const credentials = {
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASSWORD
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      throw new Error('Failed to post to WordPress');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error posting WordPress content' });
  }
};

export default handler;
