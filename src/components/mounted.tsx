'use client'
import React, { useEffect, useState } from 'react'

function Mounted({children}:{children:React.ReactNode}) {
    const [isMounted ,setIsMounted] = useState(false)
    useEffect(()=>{setIsMounted(true)},[])
    if(!isMounted){
        return null
    }
  return (<>{children}</>
  )
}

export default Mounted