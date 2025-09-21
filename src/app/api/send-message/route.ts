import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import {Message} from '@/models/User'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const {username,content} = await req.json()
        
        const user =await UserModel.findOne({username})
        if(!user){
            return NextResponse.json({
                message:"User not found.",
                success:false
            },{status:404})
        }
        if(!user.isAcceptingMessage){
             return NextResponse.json({
                message:"User is not accepting messages.",
                success:false
            },{status:403})
        }
        const newMessage = {
            content,
            createdAt:new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()
        return NextResponse.json({
            success:true,
            messages:"Message sent successfully."
        })
    } catch (error) {
        console.log("Error sending message",error);
        return Response.json(
            {
            success:false,
            message:"Error sending message."
            },
            {
            status:500
            }
        )
    }
}