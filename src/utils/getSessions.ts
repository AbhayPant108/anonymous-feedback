import {auth } from '@/app/api/auth/[...nextauth]/options'
import { User } from 'next-auth';
import { NextResponse } from 'next/server';

type ReturnSessionType ={
  success:boolean
  response?:NextResponse
  data?:User
}

export async function getUserFromSession():Promise<ReturnSessionType> {
  const session = await auth();
  const user:User = session?.user as User
  if (!session && !user) {
    return {
        success:false,
        response:NextResponse.json({
            message:"Not Authenticated.",
            success:false
        },{status:401})
    }
  }

  return {
    success:true,
    data:user
  };
}
