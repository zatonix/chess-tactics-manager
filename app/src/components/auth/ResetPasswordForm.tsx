'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

export const ResetPasswordForm = () => {
    const searchParams = useSearchParams()

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
            })
            .catch((error) => console.log('Error: ', error))
    }

    return (<form onSubmit={submitForm}>

        <Label htmlFor='password'>
            Password
        </Label>
        <Input type='password' name='pasword' placeholder='Type your password' value={userInfos.password}
            onChange={(e) => setUserInfos({ ...userInfos, password: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none'
        />
        <Label htmlFor='confirmPassword'>
            Confirm password
        </Label>
        <Input type='password' name='confirmPassword'
            placeholder='Confirm your password' value={userInfos.confirmPassword}
            onChange={(e) => setUserInfos({ ...userInfos, confirmPassword: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none'
        />
        {errorMsg.length > 0 &&
            <div className='text-red-500 text-xs'>
                {errorMsg}
            </div>}
        <Button
            className='btn btn-primary dark mt-4 mb-10 w-full rounded-none'
            onClick={submitForm}
            disabled={isLoading || !userInfos.password || !userInfos.confirmPassword}
            size='lg'
        >
            Reset your password
            {isLoading && <Loader2 className='h-4 w-4 ml-1 animate-spin' />}
        </Button>
        <p className='flex justify-center flex-row align-baseline mt-5'>
            <ArrowLeft className='text-sm' />
            <Link href='/signin' className='text-sm text-center ml-1 hover:underline'>
                Back to login
            </Link>
        </p>
    </form>)
}
