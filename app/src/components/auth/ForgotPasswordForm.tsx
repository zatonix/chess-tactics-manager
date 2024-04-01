'use client'

import ReCAPTCHA from 'react-google-recaptcha'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { verifyCaptcha } from '@/lib/recaptcha'
import { useRouter } from 'next/navigation'

export const ForgotPasswordForm = () => {
    const router = useRouter()
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [userInfos, setUserInfos] = React.useState({ email: '' })
    const [isLoading, setIsLoading] = React.useState(false)
    const [isVerified, setIsverified] = React.useState<boolean>(false)

    async function handleCaptchaSubmission(token: string | null) {
        await verifyCaptcha(token)
            .then(() => setIsverified(true))
            .catch(() => setIsverified(false))
    }

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        setIsLoading(true)

        await fetch('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email: userInfos.email,
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((res) => {
                setIsLoading(false)
                if (res.ok) {
                    toast.success('An email has been sent to you with a reset link.')
                    router.push('/signin')
                }
            })
            .catch((error) => console.log('Error: ', error))
    }

    return (<form onSubmit={submitForm}>
        <Label htmlFor='email'>
            Email
        </Label>
        <Input type='text' name='username' placeholder='Type your Email address' value={userInfos.email}
            onChange={(e) => setUserInfos({ ...userInfos, email: e.target.value })}
            className='shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none'
        />
        <div className='flex justify-center'>
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                ref={recaptchaRef}
                theme='dark'
                onChange={handleCaptchaSubmission}
            />
        </div>
        <Button
            className='btn btn-primary dark mt-4 mb-10 w-full rounded-none'
            onClick={submitForm}
            disabled={!isVerified || isLoading || !userInfos.email}
            size='lg'
        >
            Send me a reset link
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
