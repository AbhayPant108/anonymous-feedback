'use client'
import { Message, User } from "@/models/User"
import { Key, useCallback, useEffect, useState } from "react"
import { Toast } from "@/components/ui/toast"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import { MessageCard } from "@/components/message"

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
    const handleDeleteMessgae = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }
    const { data: session } = useSession()
    
    
    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
        
    })
    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages')
    const fetchAcceptMessgae = useCallback(async () => {
        setIsSwitchLoading(true)
        
        try {
            const res = await axios.get<ApiResponse>('/api/accept-messages')
            
            setValue('acceptMessages', res.data.isAcceptingMessage as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            Toast({ varient: "error", title: "Failed", description: axiosError.response?.data.message })
        }
        finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const res = await axios.get<ApiResponse>('/api/get-messages')
            console.log(res.data.messages);
            
            setMessages(res.data.messages || [])
            if (refresh) {
                Toast({ varient: "success", title: "Refreshed Messages", description: "Showing latest messages." })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            Toast({ varient: "error", title: "Failed", description: axiosError.response?.data.message })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setMessages])
    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessgae()

    }, [session, setValue, fetchAcceptMessgae, fetchMessages])
    

    const handleSwitchChange = async () => {
        try {
            console.log(acceptMessages);
            
            const res = await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages:!acceptMessages})
            console.log(res.data);
            
            setValue('acceptMessages', !acceptMessages)
            Toast({ varient: "success", title: res.data.message })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            Toast({ varient: "error", title: "Failed", description: axiosError.response?.data.message })
        }
    }
    const username = session?.user.username 

    //TODO : Search more ways to generate URL
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard =() =>{
        navigator.clipboard.writeText(profileUrl)
        Toast({varient:"success",title:"URL copied",description:"Profile url has been copied to clipboard."})
    }


    if (!session || !session.user) {
        return <h1 className="text-center text-2xl my-20">Please Login</h1>
    }
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id as Key}
                            message={message}
                            onMessageDelete={handleDeleteMessgae}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );


}