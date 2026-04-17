export async function fetchLinkedInDataProxycurl(linkedinUrl: string) {
  if (!process.env.PROXYCURL_API_KEY) {
    console.error("Missing PROXYCURL_API_KEY");
    throw new Error("Proxycurl API key is missing. Add it to .env");
  }

  try {
    const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(linkedinUrl)}&use_cache=if-present`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.PROXYCURL_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Proxycurl error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize into our DB format
    return {
      headline: data.headline,
      summary: data.summary,
      location: `${data.city}, ${data.country}`,
      experience: data.experiences.map((exp: any) => ({
        company: exp.company,
        title: exp.title,
        starts_at: exp.starts_at,
        ends_at: exp.ends_at,
        description: exp.description
      })),
      education: data.education.map((edu: any) => ({
        school: edu.school,
        degree: edu.degree_name,
        field: edu.field_of_study,
        starts_at: edu.starts_at,
        ends_at: edu.ends_at
      })),
      skills: data.skills || []
    };
  } catch (error) {
    console.error("LinkedIn Proxycurl failed:", error);
    return null;
  }
}
