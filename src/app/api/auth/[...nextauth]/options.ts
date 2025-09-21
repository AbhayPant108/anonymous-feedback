import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { use } from "react";
 
export const {handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        id:"credentials",
        name:"Ohno",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
  await dbConnect();
  try {
    const user = await UserModel.findOne({ email: credentials?.email }).select('_id username isVerified isAcceptingMessage password')
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Please verify your account before login");
    
    const isPasswordCorrect = await bcrypt.compare(
      String(credentials?.password),
      user.password
    );
    if (!isPasswordCorrect) throw new Error("Incorrect password");
    return user;
    
  } catch (error) {
    console.error(error);
    return null; // better than throwing (NextAuth expects null for invalid creds)
  }
}
,
    }),
  ],
  callbacks:{
    async jwt({token,user}) {
        if(user){
            token._id=user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user.isAcceptingMessage
            token.username = user.username
        }
        return token},

    async session({session,token}){
        if(token){
            session.user._id=token._id?.toString()
            session.user.isVerified = token.isVerified as boolean
            session.user.isAcceptingMessage = token.isAcceptingMessage as boolean
            session.user.username = token.username as string
        }
        return session}
    
        
    },
  pages:{
    signIn:'/sign-in'
  },
  session:{
    strategy:"jwt",
  },
  secret:process.env.AUTH_SECRET
})