"use client"

import React from 'react'
import { signIn } from "next-auth/react";

export const LoginButton = () => {

    const handleSignin = async () => {
        await signIn()
    }

    return (
        <button className="btn btn-secondary" onClick={handleSignin}>
            Login
        </button>
    )
}
