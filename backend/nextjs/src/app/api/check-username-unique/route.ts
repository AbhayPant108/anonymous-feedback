import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {success, z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";


const UsrnameQuerySchema = z.object({
    username:usernameValidation
})
export async function GET(req:NextRequest) {
    // if(req.method!=='GET'){
    //     return NextResponse.json({
    //         success:false,
    //         message:"Method not allowed."
    //     },{status:405})
    // }

    await dbConnect()
    try {
        const {searchParams} = req.nextUrl
        console.log(searchParams.get('username'));
        
        const queryParams = {
            username:searchParams.get('username')
        }
        //validate with zod
        
        const result = UsrnameQuerySchema.safeParse(queryParams)
        // console.log("REsults",result);
        if(!result.success){
            //getting only errors of username property
            const usernameErrors = result.error.format().username?._errors || []
            // console.log(usernameErrors);
            
            return NextResponse.json({
                success:false,
                message:usernameErrors?.length>0 ? usernameErrors.join(','):'Invalid query parameters.'
            },{status:400})
        }
        const {username} = result.data
        const user = await User.findOne({
            username,
            isVerified:true
        })
        if(user){
            return NextResponse.json({
                success:false,
                message:"Username is already taken."
            },{status:400})
        }
        return NextResponse.json({
            success:true,
            message:"Username available."
        },{status:200 })
        
        
    } catch (error) {
        console.log("Error checking username",error);
    return NextResponse.json({
        success:false,
        message:"Error checking username"
    },{status:500})        
    }
}