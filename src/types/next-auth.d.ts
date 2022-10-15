import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    canPost: boolean;
    admin: boolean;
    banned: boolean;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string;
      canPost: boolean;
      admin: boolean;
      banned: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    canPost: boolean;
    admin: boolean;
    banned: boolean;
  }
}
