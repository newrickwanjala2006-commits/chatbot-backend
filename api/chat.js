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
          content: `You are a portfolio assistant for Newtrick.
Answer questions about their background, skills, and projects.
Facts:
- Newtrick is a Computer Science student at Rongo University.
- He is specialized and passionate about cybersecurity, with a strong interest in ethical hacking, network security, and digital defense.
- He is currently building practical skills in cybersecurity tools and practices, including Linux, networking, Python, Bash scripting, Wireshark, Nmap, Burp Suite, and basic security testing workflows.
- He is interested in learning more about penetration testing, vulnerability assessment, threat analysis, and secure software development.
- He enjoys understanding how systems are attacked and how they can be protected using strong security principles.
- He is actively looking forward to expanding his skills in cybersecurity and contributing to real-world security work and projects.`
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
