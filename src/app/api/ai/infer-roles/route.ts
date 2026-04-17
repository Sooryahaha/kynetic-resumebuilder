import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
  try {
    const { githubData, linkedinData } = await req.json();

    const prompt = `
    Analyze the following candidate data to predict 3 distinct, highly relevant job titles they are suited for.
    Return ONLY a JSON array of strings, e.g. {"roles": ["Senior Software Engineer", "Product Manager", "DevOps Engineer"]}.
    Do NOT return any other text, just the raw JSON object.
    
    Github Data summary:
    ${JSON.stringify(githubData?.topLanguages)}
    
    LinkedIn Experience:
    ${JSON.stringify(linkedinData?.experience?.slice(0,3))}
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content || '{"roles":[]}';
    const result = JSON.parse(content);
    
    const roles = Array.isArray(result) ? result : result.roles;

    return NextResponse.json({ roles: roles || ["Software Engineer", "Frontend Developer", "Backend Engineer"] });
  } catch (error: any) {
    console.error("Groq Inference Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
