import toast from 'react-hot-toast'
import {cn} from '@/lib/utils'
import Image from 'next/image'
interface toastProps{
    title:React.ReactNode
    description?:string
    imageSrc?:string
    className?:string
    varient?:"success" | "error" | undefined
}
export const Toast = (props:toastProps) => {
    if(props.varient === "error"){
         toast.error((t)=><div className={cn("flex w-full ",props.className || "")}>
            {props.imageSrc && <Image src={props.imageSrc!} alt='error'/>}
            <div className='w-full'>
            <h1 id='title' className='text-xl text-blue-500'>{props.title}</h1>
            <p className=' break-normal'>{props.description}</p>
            </div>
        </div>)
    }
   else if(props.varient === "success"){
         toast.success((t)=><div className={cn("flex w-full ",props.className || "")}>
            {props.imageSrc && <Image src={props.imageSrc!} alt='error'/>}
            <div className='w-full'>
            <h1 id='title' className='text-xl text-blue-500'>{props.title}</h1>
            <p className=' break-normal'>{props.description}</p>
            </div>
        </div>)
    }
    else {toast((t)=><div className={cn("flex w-full ",props.className || "")}>
            {props.imageSrc && <Image src={props.imageSrc!} alt='error'/>}
            <div className='w-full'>
            <h1 id='title' className='text-xl text-blue-500'>{props.title}</h1>
            <p className=' break-normal'>{props.description}</p>
            </div>
        </div>)
    }

        return null
    
}