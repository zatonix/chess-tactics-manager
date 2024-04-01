'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export const LoginButton = () => {

    const handleSignin = async () => {
        await signIn()
    }

    return (
        <Button className='btn btn-secondary' onClick={handleSignin}>
            Login
        </Button>
    )
}
