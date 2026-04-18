import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
  try {
    const { githubData, linkedinData } = await req.json();

    const languageList = Object.entries(githubData?.topLanguages || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([lang]) => lang)
      .slice(0, 5)
      .join(", ");

    const topRepos = (githubData?.repositories || [])
      .slice(0, 3)
      .map((r: any) => `${r.name}${r.description ? ` — ${r.description}` : ""} (${r.language || "code"})`)
      .join("; ");

    const prompt = `
You are a senior career strategist. Analyze the candidate's GitHub and LinkedIn data below and predict exactly 3 distinct, realistic job titles they are best suited for RIGHT NOW based on their current skills and experience level.

Return ONLY valid JSON: {"roles": ["Title 1", "Title 2", "Title 3"]}

Rules:
- Be specific (e.g. "Senior React Developer" not "Software Engineer")
- Match seniority to experience level (don't suggest Staff/Principal for juniors)
- Base it primarily on their actual code (languages, repos) and LinkedIn headline

GitHub: username=${githubData?.username}, top languages=${languageList}, top repos=[${topRepos}], stars=${githubData?.totalStars}
LinkedIn: name=${linkedinData?.name}, headline=${linkedinData?.headline || "not available"}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"roles":[]}');
    const roles = Array.isArray(result) ? result : result.roles;
    return NextResponse.json({ roles: roles?.length ? roles : ["Software Engineer", "Full Stack Developer", "Frontend Engineer"] });
  } catch (error: any) {
    console.error("Groq Inference Failed:", error);
    return NextResponse.json({ roles: ["Software Engineer", "Full Stack Developer", "Frontend Engineer"] });
  }
}
