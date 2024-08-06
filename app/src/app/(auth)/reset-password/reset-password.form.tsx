'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '../../../components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'

export const ResetPasswordForm = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [userInfos, setUserInfos] = React.useState({ password: '', confirmPassword: '' })
    const [errorMsg, setErrorMsg] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const validateInputs = () => {
        if (userInfos.password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long')
            return false
        }
        if (userInfos.password !== userInfos.confirmPassword) {
            setErrorMsg('Passwords do not match')
            return false
        }
        return true
    }

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (!validateInputs())
            return

        setIsLoading(true)
        if (!searchParams || !searchParams.get('token')) {
            return
        }

        const newPassword = {
            tokenId: searchParams.get('token'),
            password: userInfos.password,
        }

        await fetch('/api/auth/reset-password', {
            method: 'PUT',
            body: JSON.stringify(newPassword),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then(() => {
                setIsLoading(false)
                toast.success('Password reset successfully')
                router.push('/signin')
            })
            .catch((error) => console.log('Error: ', error))
    }

    return (<form onSubmit={submitForm}>

        <Label htmlFor='password'>
            Password
        </Label>
        <Input type='password' name='pasword' placeholder='Type your password' value={userInfos.password}
            onChange={(e) => setUserInfos({ ...userInfos, password: e.target.value })}
            className='w-full h-10 px-3 py-2 mt-2 mb-4 border rounded-none shadow-md border-background bg-background'
        />
        <Label htmlFor='confirmPassword'>
            Confirm password
        </Label>
        <Input type='password' name='confirmPassword'
            placeholder='Confirm your password' value={userInfos.confirmPassword}
            onChange={(e) => setUserInfos({ ...userInfos, confirmPassword: e.target.value })}
            className='w-full h-10 px-3 py-2 mt-2 mb-4 border rounded-none shadow-md border-background bg-background'
        />
        {errorMsg.length > 0 &&
            <div className='text-xs text-red-500'>
                {errorMsg}
            </div>}
        <Button
            className='w-full mt-4 mb-10 rounded-none dark'
            onClick={submitForm}
            disabled={isLoading || !userInfos.password || !userInfos.confirmPassword}
            size='lg'
        >
            Reset your password
            {isLoading && <Loader2 className='ml-1 size-4 animate-spin' />}
        </Button>
        <p className='flex flex-row justify-center mt-5 align-baseline'>
            <ArrowLeft className='text-sm' />
            <Link href='/signin' className='ml-1 text-sm text-center hover:underline'>
                Back to login
            </Link>
        </p>
    </form>)
}
