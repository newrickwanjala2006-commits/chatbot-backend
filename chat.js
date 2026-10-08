import OpenAI from "openai";

export default async function handler(req, res) {
  // Allow your GitHub Pages site to talk to this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The API key is read from Vercel's environment variables (safe!)
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  try {
    const { messages } = req.body;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a portfolio assistant for [YOUR NAME]. 
Answer questions about their background, skills, and projects.
Facts: [LIST A FEW FACTS ABOUT YOURSELF HERE]`
        },
        ...messages
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
