import NextAuth from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// @ts-ignore
import { NextAuthOptions } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
