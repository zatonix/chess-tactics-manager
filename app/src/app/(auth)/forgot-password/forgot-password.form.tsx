'use client'

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifyCaptcha } from '@/lib/recaptcha'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from '../../../components/ui/button'
import { forgotPasswordAction } from './forgot-password.action'
import { ForgotPasswordSchema, ForgotPasswordType } from './forgot-password.schema'

export const ForgotPasswordForm = () => {
    const router = useRouter()
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [isVerified, setIsverified] = React.useState<boolean>(false)

    const form = useForm<ForgotPasswordType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    })

    async function handleCaptchaSubmission(token: string | null) {
        await verifyCaptcha(token)
            .then(() => setIsverified(true))
            .catch(() => setIsverified(false))
    }

    const mutation = useMutation({
        mutationKey: ['forgot-password'],
        mutationFn: async (formData: ForgotPasswordType) => {
            if (!isVerified) {
                form.setError('root', { message: 'Please verify that you are not a robot' })
                return
            }

            try {
                await forgotPasswordAction(formData)
            } catch (e: any) {
                form.setError('root', { message: e.message })
                return
            }

            toast.success('An email has been sent to you with a reset link.')
            router.push('/signin')
        }
    })

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(async (data) => await mutation.mutateAsync(data))}>
            <FormField
                name='email'
                control={form.control}
                disabled={form.formState.isSubmitting}
                render={(context) => (
                    <FormItem>
                        <FormLabel>
                            Email
                        </FormLabel>
                        <Input
                            type='text'
                            placeholder='Type your Email address'
                            {...context.field}
                            className={`mb-4 mt-2 h-10 w-full rounded-none border
                             border-background bg-background px-3 py-2 shadow-md`}
                        />
                        {form.formState.errors.email && <FormMessage>
                            {form.formState.errors.email.message}
                        </FormMessage>}
                    </FormItem>
                )}
            />

            <div className='mt-4 flex justify-center'>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    ref={recaptchaRef}
                    theme='dark'
                    onChange={handleCaptchaSubmission}
                />
            </div>

            <Button
                className='dark mb-10 mt-4 w-full rounded-none'
                type='submit'
                disabled={!isVerified || form.formState.isSubmitting}
                size='lg'
            >
                Send me a reset link
                {form.formState.isSubmitting && <Loader2 className='ml-1 size-4 animate-spin' />}
            </Button>

            <p className='mt-5 flex flex-row justify-center align-baseline'>
                <ArrowLeft className='text-sm' />
                <Link href='/signin' className='ml-1 text-center text-sm hover:underline'>
                    Back to login
                </Link>
            </p>

        </form>
    </Form>)
}
