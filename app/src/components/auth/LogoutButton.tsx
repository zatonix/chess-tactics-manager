"use client"

import React from 'react'
import { signOut } from "next-auth/react";

export const LogoutButton = () => {

    const handleSignout = async () => {
        await signOut()
    }

    return (
        <button className="btn btn-secondary" onClick={handleSignout}>
            Logout
        </button>
    )
}
