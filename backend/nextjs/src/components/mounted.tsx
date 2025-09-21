'use client'
import React, { useEffect, useState } from 'react'

function mounted({children}:{children:React.ReactNode}) {
    const [isMounted ,setIsMounted] = useState(false)
    useEffect(()=>{setIsMounted(true)},[])
    if(!isMounted){
        return null
    }
  return (<>{children}</>
  )
}

export default mounted