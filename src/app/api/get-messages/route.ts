import {getUserFromSession}  from '@/utils/getSessions'
import UserModel from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { useStyleRegistry } from 'styled-jsx'
import { success } from 'zod'
import { ApiResponse } from '@/types/ApiResponse'

export async function GET(req:NextRequest) {
    try {
        const getUser = await getUserFromSession()
        if(!getUser.success){
            return getUser.response
        }
        
        const userId=new mongoose.Types.ObjectId(getUser.data?._id)
         const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
         ])
         
         if(user && user.length!==0){

            return NextResponse.json<ApiResponse>({
                success:false,
                message:"Fetched messages successfully.",
                messages:user[0].messages
            },{status:200})
         }
         return NextResponse.json<ApiResponse>({
                success:true,
                message:"No messages to show.",
                messages:[]
            },{status:200})
         
    } catch (error) {
        console.log("Error fetching messages",error);
        return Response.json(
            {
            success:false,
            message:"Error fetching messages."
            },
            {
            status:500
            }
        )
    }
}