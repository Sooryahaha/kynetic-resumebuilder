import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const linkedinAccount = await prisma.account.findFirst({
      where: { userId: session.user.id, provider: "linkedin" }
    });

    if (!linkedinAccount?.access_token) {
      return NextResponse.json({ error: "LinkedIn account not linked" }, { status: 400 });
    }

    // Standard LinkedIn consumer OAuth only provides basic profile.
    const userRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${linkedinAccount.access_token}` }
    });
    const emailRes = await fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
      headers: { Authorization: `Bearer ${linkedinAccount.access_token}` }
    });

    const user = await userRes.json();
    
    // As per the limitation identified, LinkedIn does NOT provide experience/timeline.
    // We send back what we legally can via the free OAuth, and the AI Pipeline relies on GitHub.
    const linkedinData = {
      name: `${user?.localizedFirstName || ''} ${user?.localizedLastName || ''}`.trim(),
      experience: [], // Must be filled manually later by user due to LinkedIn restriction
      education: [],
      skills: []
    };

    return NextResponse.json(linkedinData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
