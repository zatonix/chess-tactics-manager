'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { verifyCaptcha } from '@/lib/recaptcha'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

export const SignupForm = () => {
    const Router = useRouter()
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    const [userInfos, setUserInfos] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [errorMsg, setErrorMsg] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [isVerified, setIsverified] = React.useState<boolean>(false)

    async function handleCaptchaSubmission(token: string | null) {
        await verifyCaptcha(token)
            .then(() => setIsverified(true))
            .catch(() => setIsverified(false))
    }

    const validateInputs = () => {
        if (userInfos.email.length < 1) {
            setErrorMsg('Email is required')
            return false
        }
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

        if (!isVerified) {
            setErrorMsg('Please verify that you are not a robot')
            return
        }

        const newUser = {
            email: userInfos.email,
            password: userInfos.password
        }

        setIsLoading(true)
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        setIsLoading(false)

        if (data.userExists) {
            setErrorMsg('A user with the same email already exists')
        } else {
            setUserInfos({
                email: '',
                password: '',
                confirmPassword: '',
            })
            setErrorMsg('')
            Router.push('/signin')
            toast.success('Account created successfully')
        }
    }

    return (<form onSubmit={submitForm}>
        <Label htmlFor='email'>
            Email
        </Label>
        <Input type='text' name='username' placeholder='Type your Email address' value={userInfos.email}
            onChange={(e) => setUserInfos({ ...userInfos, email: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none' />
        <Label htmlFor='password'>
            Password
        </Label>
        <Input type='password' name='password' placeholder='Type your Password' value={userInfos.password}
            onChange={(e) => setUserInfos({ ...userInfos, password: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none' />
        <Label htmlFor='confirmPassword'>
            Password confirmation
        </Label>
        <Input type='password' name='confirmPassword' placeholder='Type your Password' value={userInfos.confirmPassword}
            onChange={(e) => setUserInfos({ ...userInfos, confirmPassword: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none' />
        {errorMsg.length > 0 &&
            <div className='text-red-500 text-xs'>
                {errorMsg}
            </div>}
        <div className='flex justify-center'>
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                ref={recaptchaRef}
                theme='dark'
                onChange={handleCaptchaSubmission}
            />
        </div>
        <Button className='btn btn-primary dark mt-4 w-full rounded-none' size='lg'
            onClick={submitForm}
            disabled={!isVerified || isLoading || !userInfos.email || !userInfos.password || !userInfos.confirmPassword}
        >
            Register
            {isLoading && <Loader2 className='h-4 w-4 ml-1 animate-spin' />}
        </Button>
    </form>)
}
