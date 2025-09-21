'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import z from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { useParams } from 'next/navigation'
import { Toast } from '@/components/ui/toast'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react';

function page() {
    const [isSending , setIsSending] = useState<boolean>(false)
    const {username} = useParams<{username:string}>()
    const form = useForm({
        resolver:zodResolver(messageSchema),
        defaultValues:{
            content:''
        }
    })
    const sendMessage = async(data:z.infer<typeof messageSchema>)=>{
        setIsSending(true)
        try {
            const res = await axios.post<ApiResponse>('/api/send-message',{username,content:data.content})
            Toast({varient:"success",title:"Message Sent",description:res.data.message})
        } catch (error) {
            const err = error as AxiosError<ApiResponse>
            Toast({varient:"error",title:"Message not sent",description:err.response?.data.message})
           
        }finally{
            setIsSending(false)
        }
    }

  return (
    <Form  {...form}>
    <div className='text-center mx-auto'>
      <form onSubmit={form.handleSubmit(sendMessage)} className="mx-auto w-2/3 mt-10 space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Anonymous Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your message here"
                    className="w-full max-w-full p-2 border whitespace-pre-wrap rounded break-words resize-y"
                  {...field}
                />

              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSending} type="submit">{isSending?(<span className='flex justify-between items-center gap-1'><Loader2 /> "Sending"</span>):"Send Message"}</Button>
      </form>
    </div>

    </Form>
  )
}




export default page