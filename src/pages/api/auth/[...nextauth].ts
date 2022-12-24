import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

import bcrypt from "bcrypt";
import { toSeconds } from "@carljmcgee/timey-wimey";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.admin = token.admin;
        session.user.canPost = token.canPost;
        session.user.banned = token.banned;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.admin = user.admin;
        token.canPost = user.canPost;
        token.banned = user.banned;
      }
      return token;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "your email",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@email.com" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },

      async authorize(credentials, req) {
        const User = prisma.user;

        if (!credentials) {
          return null;
        }

        const user = await User.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) {
          return null;
        }

        const isPassword = await bcrypt.compare(
          credentials?.password,
          user?.password
        );
        if (!isPassword) {
          return null;
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: toSeconds(0, 0, 0, 4),
  },
};

export default NextAuth(authOptions);
