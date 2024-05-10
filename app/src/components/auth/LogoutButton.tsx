'use client'

import React from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export const LogoutButton = () => {

    const handleSignout = async () => {
        await signOut()
    }

    return (
        <Button onClick={handleSignout}>
            Logout
        </Button>
    )
}
