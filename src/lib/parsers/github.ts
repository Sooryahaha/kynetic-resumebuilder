export async function fetchGithubData(username: string) {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}
    });
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}
    });

    if (!userRes.ok || !reposRes.ok) {
      throw new Error("Failed to fetch Github data");
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

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

    // Sort languages by usage
    const topLanguages = Object.fromEntries(
      Object.entries(languages).sort(([, a], [, b]) => b - a).slice(0, 5)
    );

    return {
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
  } catch (error) {
    console.error("Github extraction failed:", error);
    return null;
  }
}
