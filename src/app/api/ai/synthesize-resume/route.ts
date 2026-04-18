import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
  try {
    const { targetRole, linkedinData, githubData } = await req.json();

    // Build a rich context from BOTH sources
    const languages = Object.entries(githubData?.topLanguages || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([lang, count]) => `${lang} (${count} repos)`)
      .join(", ");

    const repos = (githubData?.repositories || []).slice(0, 4).map((r: any) =>
      `• ${r.name}: ${r.description || "No description"} [${r.language || "code"}, ★${r.stars}]`
    ).join("\n");

    const prompt = `
You are an elite ATS resume writer and career coach. Generate an optimized resume JSON for a candidate targeting: "${targetRole}"

Use BOTH data sources below. GitHub proves technical skills. LinkedIn provides identity and professional context.

Return ONLY valid JSON with this exact structure (no markdown, no backticks):
{
  "blocks": [
    {"id": "header", "type": "header", "title": "Contact", "content": "FULL_NAME\\nEMAIL | PHONE | LOCATION\\ngithub.com/USERNAME"},
    {"id": "summary", "type": "summary", "title": "Professional Summary", "content": "3-4 sentences packed with keywords for ${targetRole}. Mention top technologies from GitHub. 100-120 words."},
    {"id": "skills", "type": "skills", "title": "Technical Skills", "content": "Languages: ...\\nFrameworks: ...\\nTools: ..."},
    {"id": "projects", "type": "experience", "title": "Notable Projects", "content": "• Project Name (LANGUAGE) — Description. Impact/result.\\n• ..."},
    {"id": "exp1", "type": "experience", "title": "COMPANY | ROLE", "content": "• Achievement with metric (e.g. Reduced load time by 40%)\\n• ..."},
    {"id": "edu1", "type": "education", "title": "UNIVERSITY | Degree", "content": "Graduation year · GPA if notable"}
  ]
}

REQUIRED RULES:
- Every bullet MUST start with a strong action verb (Built, Designed, Reduced, Led, Shipped...)  
- Include quantified metrics wherever possible
- Extract languages/frameworks from GitHub data and list them accurately
- Pull the candidate's NAME and LINKEDIN HEADLINE for the summary context
- Map GitHub repos into the Projects section with real descriptions
- Use ATS keywords specific to "${targetRole}" throughout

GitHub Data:
- Username: ${githubData?.username || "N/A"}
- Bio: ${githubData?.bio || "N/A"}
- Top Languages: ${languages || "N/A"}
- Top Repos:
${repos || "N/A"}
- Total Stars: ${githubData?.totalStars || 0}

LinkedIn Data:
- Name: ${linkedinData?.name || "N/A"}
- Headline: ${linkedinData?.headline || "N/A"}
- Location: ${linkedinData?.location || "N/A"}
- Experience: ${JSON.stringify(linkedinData?.experience?.slice(0, 2) || [])}
- Education: ${JSON.stringify(linkedinData?.education?.slice(0, 1) || [])}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || '{"blocks":[]}';
    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Groq Synthesis Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
