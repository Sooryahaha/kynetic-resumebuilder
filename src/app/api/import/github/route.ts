import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const githubAccount = await prisma.account.findFirst({
      where: { userId: session.user.id, provider: "github" }
    });

    if (!githubAccount?.access_token) {
      return NextResponse.json({ error: "GitHub account not linked or missing permissions" }, { status: 400 });
    }

    // 1. Fetch user data
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubAccount.access_token}` }
    });
    const user = await userRes.json();

    // 2. Fetch authenticated user's repos
    const reposRes = await fetch(`https://api.github.com/user/repos?per_page=100&sort=pushed`, {
      headers: { Authorization: `Bearer ${githubAccount.access_token}` }
    });
    const repos = await reposRes.json();

    if (!reposRes.ok) throw new Error("Failed to extract repository metrics");

    let totalStars = 0;
    let totalForks = 0;
    const languages: Record<string, number> = {};

    repos.forEach((repo: any) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.fromEntries(
      Object.entries(languages).sort(([, a], [, b]) => b - a).slice(0, 5)
    );

    const githubData = {
      username: user.login,
      bio: user.bio,
      topLanguages,
      totalStars,
      totalForks,
      repositories: repos.slice(0, 5).map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        url: r.html_url
      })).filter((r:any) => r.stars > 0)
    };

    return NextResponse.json(githubData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
