import { AIGenerationInput, AIGenerationOutput, ResumeBlock, ATSDetails } from "@/types/resume";

// This simulates the complex AI pipeline defined in the plan:
// Fetch -> Normalize -> Skill Extract -> Role Infer -> Project Rank -> ATS Rewrite -> Template Format -> Score

export async function generateResumeWithAI(input: AIGenerationInput): Promise<AIGenerationOutput> {
  console.log("Starting AI generation pipeline for role:", input.targetRole);
  
  // In a real production setup, this would call OpenAI via Vercel AI SDK:
  // const response = await generateObject({
  //   model: openai("gpt-4o"),
  //   schema: resumeSchema,
  //   prompt: `Generate a resume for ${input.targetRole}...`
  // });

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { linkedInProfile, gitHubProfile, targetRole } = input;
  const name = linkedInProfile?.fullName || gitHubProfile?.name || "Alex Builder";

  // Mocked AI output aligned with ATS best practices
  const blocks: ResumeBlock[] = [
    {
      id: "header-1",
      type: "header",
      visible: true,
      order: 0,
      data: {
        fullName: name,
        headline: `${targetRole} | Specialized in scalable systems`,
        email: linkedInProfile?.email || "alex@kynetic.com",
        phone: "+1 (555) 123-4567",
        location: linkedInProfile?.location || "San Francisco, CA",
        linkedin: linkedInProfile?.profileUrl || "linkedin.com/in/alex",
        github: gitHubProfile?.profileUrl || "github.com/alex",
      }
    },
    {
      id: "summary-1",
      type: "summary",
      visible: true,
      order: 1,
      data: `Dynamic and results-oriented ${targetRole} with a proven track record of architecting scalable applications and driving technical innovation. Expert in utilizing modern frameworks to deliver high-impact solutions that optimize performance by over 40% and enhance user experience. Adept at leading cross-functional teams from conception through deployment.`
    },
    {
      id: "experience-1",
      type: "experience",
      visible: true,
      order: 2,
      data: [
         {
           id: "exp-1",
           company: "NextGen Tech Solutions",
           title: "Senior Product Architect",
           startDate: "2021-04",
           endDate: "Present",
           current: true,
           location: "Remote",
           description: "Leading frontend architecture and AI integration.",
           bullets: [
             "Architected a scalable real-time processing engine handling 1M+ daily events, reducing latency by 35%.",
             "Spearheaded the integration of OpenAI LLMs into core workflows, increasing user retention by 22%.",
             "Mentored a team of 6 engineers, establishing rigorous code quality standards and CI/CD best practices."
           ]
         },
         {
           id: "exp-2",
           company: "Global Innovations Inc.",
           title: "Software Engineer",
           startDate: "2018-06",
           endDate: "2021-03",
           current: false,
           location: "San Francisco, CA",
           description: "Developed full-stack features for enterprise clients.",
           bullets: [
             "Developed and deployed a robust payment processing microservice, achieving 99.99% uptime.",
             "Optimized PostgreSQL database queries, decreasing average load time from 2.1s to 400ms.",
             "Collaborated with product managers to define technical requirements for 3 major product launches."
           ]
         }
      ]
    },
    {
      id: "projects-1",
      type: "projects",
      visible: true,
      order: 3,
      data: [
        {
          id: "proj-1",
          name: "Kynetic ATS Engine",
          description: "AI-powered resume optimization tool.",
          technologies: ["Next.js", "TypeScript", "Prisma", "OpenAI"],
          bullets: [
            "Engineered a proprietary ATS scoring algorithm that increased match rates by 45%.",
            "Built a high-performance React frontend utilizing Framer Motion for premium user interactions."
          ],
          github: "github.com/kynetic/ats-engine"
        }
      ]
    },
    {
       id: "skills-1",
       type: "skills",
       visible: true,
       order: 4,
       data: [
         {
           id: "sk-cat-1",
           category: "Languages & Frameworks",
           items: ["TypeScript", "JavaScript", "Python", "React", "Next.js", "Node.js"]
         },
         {
           id: "sk-cat-2",
           category: "Cloud & Tools",
           items: ["AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Git"]
         }
       ]
    }
  ];

  const atsDetails: ATSDetails = {
    overall: 92,
    categories: {
      keywordMatchability: { label: "Keywords", score: 28, maxScore: 30, weight: 30, suggestions: [] },
      bulletStrength: { label: "Impact", score: 23, maxScore: 25, weight: 25, suggestions: [] },
      sectionCompleteness: { label: "Completeness", score: 20, maxScore: 20, weight: 20, suggestions: [] },
      formattingCompliance: { label: "Format", score: 13, maxScore: 15, weight: 15, suggestions: ["Avoid tables"] },
      roleAlignment: { label: "Alignment", score: 8, maxScore: 10, weight: 10, suggestions: [] }
    },
    missingKeywords: ["Agile", "GraphQL", "Leadership"],
    weakBullets: ["Developed full-stack features for enterprise clients." ],
    recommendations: ["Add more specific metrics to your older experience.", "Include relevant certifications if you have them."],
    strengths: ["Strong action verbs used in recent roles.", "Clear career progression demonstrated."]
  };

  return {
    blocks,
    atsDetails,
    inferredRole: targetRole,
    inferredSeniority: "Senior/Lead",
    inferredDomain: "Software Engineering"
  };
}

export async function rewriteBulletWithAI(bullet: string, targetRole: string): Promise<string> {
    // Simulate AI rewriting a weak bullet to a strong one
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (bullet.includes("Worked on web app")) {
        return "Architected and deployed a highly available web application, improving workflow efficiency by 35% for over 10,000 active users.";
    }
    
    return `Spearheaded initiatives related to ${bullet.split(' ')[0].toLowerCase()}, resulting in a 20% increase in overall system efficiency.`;
}
