import { success } from "zod";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        const {verifyCode,username} = await req.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await User.findOne({username:decodedUsername})
        if(!user){
            return NextResponse.json({  
                message:"User not found.",
                success:false
            },{status:404})
        }
        const isCodeValid = user.verifyCode === verifyCode
        const isCodeNotExpired = user.verifyCodeExpiry > new Date()
        console.log(isCodeValid);
        
        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()
            return NextResponse.json({
                message:"Account verified successfully.",
                success:true
            },{status:200})
        }
        else if(!isCodeNotExpired){
            return NextResponse.json({
                message:"Verify Code is expired.",
                success:false
            },{status:400})
        }
        return NextResponse.json({
                message:"Verify Code is not valid,please signup again.",
                success:false
            },{status:400})

    } catch (error) {
         console.log("Error verifying username",error);
            return NextResponse.json({
                success:false,
                message:"Error verifying username"
            },{status:500})        
            }
    }
