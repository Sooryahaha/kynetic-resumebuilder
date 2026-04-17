import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const LinkedInProvider = {
  id: "linkedin",
  name: "LinkedIn",
  type: "oauth" as const,
  clientId: process.env.LINKEDIN_CLIENT_ID!,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  authorization: {
    url: "https://www.linkedin.com/oauth/v2/authorization",
    params: {
      scope: "r_liteprofile r_emailaddress",
      response_type: "code",
    },
  },
  token: "https://www.linkedin.com/oauth/v2/accessToken",
  userinfo: "https://api.linkedin.com/v2/me",
  profile(profile: Record<string, unknown>) {
    const firstName = (profile.localizedFirstName as string) ?? "";
    const lastName = (profile.localizedLastName as string) ?? "";
    return {
      id: profile.id as string,
      name: `${firstName} ${lastName}`.trim(),
      email: null,
      image: null,
    };
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email repo" } }
    }),
    LinkedInProvider,
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
