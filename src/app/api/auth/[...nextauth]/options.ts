import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: "credentials",
            name: "Ohno",
            credentials: {
                email: { label: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<User & { _id: unknown | string } | null> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ email: credentials?.email }).select('_id username isVerified isAcceptingMessage email password');
                    if (!user) throw new Error("User not found");
                    if (!user.isVerified) throw new Error("Please verify your account before login");

                    const isPasswordCorrect = await bcrypt.compare(
                        String(credentials?.password),
                        user.password
                    );
                    if (!isPasswordCorrect) throw new Error("Incorrect password");
                    return user ? {
                        _id: user._id,
                        username: user.username,
                        isAcceptingMessage: user.isAcceptingMessage,
                        isVerified: user.isVerified,

                    } : null;
                } catch (error) {
                    console.error(error);
                    return null; // NextAuth expects null for invalid creds
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        }

    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
            options: {
                httpOnly: true, // client JS cannot access
                secure: process.env.NODE_ENV === "production", // only https
                sameSite: "lax",
            }
        }
    }
});