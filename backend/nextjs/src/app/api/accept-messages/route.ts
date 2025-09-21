import {auth} from '@/app/api/auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { ApiResponse } from '@/types/ApiResponse'
import { get } from 'http'
import { User} from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req:NextRequest) {
    

    try {
    await dbConnect()
    const session = await auth()
    const  user:User = session?.user as User
    if(!session || !user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated."
        },{status:401})
    }
    const userId = user._id
    const {acceptMessages} = await req.json()
    console.log(acceptMessages);
    

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,{
            $set:{isAcceptingMessage:acceptMessages}
        },{new:true} )
    
    if(!updatedUser){
    return NextResponse.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{status:401})        
    }
    return NextResponse.json<ApiResponse>({
        success:true,
        message:"Message Acceptance status updated successfully.",
        isAcceptingMessage:updatedUser.isAcceptingMessage
    },{status:200})        
    
    } catch (error) {
        console.log("Failed to update user status to accept messages",error);
    return NextResponse.json<ApiResponse>({
        success:false,
        message:"Failed to update user status to accept messages",
    },{status:500})        
    }
}

export async function GET(req:NextRequest) {
    try {
    await dbConnect()
    const session = await auth()
    const  user:User = session?.user as User
    if(!session || !user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated."
        },{status:401})
    }
    const userId = user._id
    const getUser = await UserModel.findById(userId)
    if(!getUser){
    return NextResponse.json({
        success:false,
        message:"User not found."
    },{status:401})        
    }
    return NextResponse.json({
        success:true,
        message:"User found.",
        isAcceptingMessage:getUser.isAcceptingMessage
    },{status:200})        
    
}catch(error){
console.log("Failed to update user status to accept messages",error);
    return NextResponse.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{status:500}) 
}
}