import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
  try {
    const { targetRole, linkedinData, githubData } = await req.json();

    const prompt = `
    You are an elite executive resume writer optimizing for ATS systems. 
    The user is applying for the role of: "${targetRole}".
    
    Synthesize their raw LinkedIn and GitHub data into a polished ATS JSON format.
    Return ONLY a raw JSON object mapping EXACTLY to this schema (no markdown formatting, no backticks, no explanations!):
    {
      "blocks": [
        { "id": "header", "type": "header", "title": "Contact", "content": "Name\\nEmail\\nPhone" },
        { "id": "summary", "type": "summary", "title": "Professional Summary", "content": "..." },
        { "id": "exp1", "type": "experience", "title": "Company Name | Job Title", "content": "- Optimized XYZ by Y%..." },
        { "id": "edu1", "type": "education", "title": "University | Degree", "content": "..." }
      ]
    }
    
    Raw Data:
    GitHub: ${JSON.stringify(githubData)}
    LinkedIn: ${JSON.stringify(linkedinData)}
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content || '{"blocks":[]}';
    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Groq Synthesis Failed:", error);
    // If it fails with JSON parsing, it might have added backticks
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
