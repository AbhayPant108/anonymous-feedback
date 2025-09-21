import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import VerificationEmail from "@/lib/resend";
import { error } from "console";
import { success } from "zod";
import { NextResponse } from "next/server";

// In next js we make a promise function with the specific 
// request we want on the route because unlike express routing
//  is implicitly handled

/*
code should effectively handles both scenarious of registering a new user and updating an existing 
but unverified user account with a new password and verification code

IF existingUserByEmail EXISTS THEN
    IF existingUserByEmail.isVerified THEN
        success:false
    ELSE
        Save the updated user
ELSE
    Create a new user with the provided details
    Save the new user
*/

export async function POST(req:Request){
    await dbConnect()
    try {
        const {username,email,password} = await req.json()
        const existingUserByUsername = await User.findOne({
            username,
            isVerified:true
        })
        if(existingUserByUsername){
            return NextResponse.json({
                success:false,
                message:"Username is already taken."
            },{status:400})
        }
        const existingUserVerifiedByEmail = await User.findOne({email})
        const verifyCode:string = Math.floor(100000+Math.random()*900000).toString()
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified) return Response.json({success:false,message:"User already exist with this email"},{status:400})
                
            else{
                const hasedPassword = await bcrypt.hash(password,10)
                existingUserVerifiedByEmail.password = hasedPassword
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.isVerified=true
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserVerifiedByEmail.save()
            }
            
        }
        else {
            const hasedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser = await User.create({
                username,
                email,
                password:hasedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            if(!newUser) return NextResponse.json({
                success:false,
                message:"User registration failed."
            },{status:500})
        }
        //send verification email
       const emailResponse = await VerificationEmail(email,username,verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },
            {status:500}
        )
        }
        return Response.json({
                success:true,
                message:"User registerd successfully.Please verify your email."
            },
            {status:201})
    } catch (error) {
        console.log("Error registering user",error);
        return Response.json(
            {
            success:false,
            message:"Error registering user"
            },
            {
            status:500
            }
        )
    }
}