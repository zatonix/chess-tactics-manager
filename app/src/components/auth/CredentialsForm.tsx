'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

export const CredentialsForm = () => {

    const Router = useRouter()
    const [userInfos, setUserInfos] = React.useState({ email: '', password: '', remember: true })
    const [isError, setIsError] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const response = await signIn(
            'credentials',
            { email: userInfos.email, password: userInfos.password, redirect: false }
        )
        if (response?.error) {
            setIsError(true)
        }
        else {
            Router.push('/')
        }
        setIsLoading(false)
    }

    return (<form onSubmit={submitForm}>
        <Label htmlFor='email'>
            Email
        </Label>
        <Input type='text' name='email' placeholder='Type your Email address' value={userInfos.email}
            onChange={(e) => setUserInfos({ ...userInfos, email: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none' />
        <Label htmlFor='password'>
            Password
        </Label>
        <Input type='password' name='password' placeholder='Type your Password' value={userInfos.password}
            onChange={(e) => setUserInfos({ ...userInfos, password: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none' />
        {isError && <div className='text-red-500 text-xs mb-5'>
            Invalid login or password
        </div>}
        <div className='flex flex-col sm:flex-row items-end sm:justify-between gap-2 text-xs mb-6'>
            <div className='flex justify-center items-center gap-2'>
                <Checkbox
                    checked={userInfos.remember}
                    onClick={() => { setUserInfos({ ...userInfos, remember: !userInfos.remember }) }}
                />
                Remember me
            </div>
            <Link href='/forgot-password' className='hover:underline'>
                Forgot your password?
            </Link>
        </div>
        <Button
            className='btn btn-primary dark mt-4 w-full rounded-none'
            onClick={submitForm}
            size='lg'
        >
            Connexion
            {isLoading && <Loader2 className='h-4 w-4 ml-1 animate-spin' />}
        </Button>
    </form >)
}
