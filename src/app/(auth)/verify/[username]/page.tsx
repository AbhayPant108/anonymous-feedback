'use client'
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {Loader2} from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Toast } from "@/components/ui/toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios,{AxiosError} from "axios";
import { verifySchema } from "@/schemas/verifySchema";

export default function Verify(){
    const {username} = useParams<{username:string}>()
    const [isVerifying,setIsVerifying] = useState<boolean>(false)
    const router = useRouter()
    const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
          try {
      const response = await axios.post<ApiResponse>('/api/verify-code',{username,...data})
      Toast({title:'Success',description:response.data.message,varient:"success"}) 
      router.replace(`/sign-in`)
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponse>
      Toast({title:'Failed',description:axioserror.response?.data.message,varient:"error"})
    }finally{
      setIsVerifying(false)
    }
    }
    const form = useForm({
        resolver:zodResolver(verifySchema),
        defaultValues:{
            verifyCode:''
        }
    })

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
    )
    
}