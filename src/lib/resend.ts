import type { NextApiRequest, NextApiResponse } from 'next';
import  EmailTemplate  from '../../email/verificationEmail';
import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse'
import {render} from '@react-email/render'

 const resend = new Resend(process.env.RESEND_API_KEY);
export default async (email:string | string[],username:string,verifyCode:string):Promise<ApiResponse> => {
  try{
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Mystry message | Verification code',
    react: EmailTemplate({username,otp:verifyCode}) ,
  });
  return {message:"Verification Code sent successfully",success:true}
}

  catch (error) {
    console.log("Error sending verification email",error);
    return {message:"Failed to send verification email" , success:false}
  }

};