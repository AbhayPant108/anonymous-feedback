import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
    };
  }

  interface User {
    _id?: string|unknown;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }

  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
