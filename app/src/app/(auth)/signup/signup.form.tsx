'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifyCaptcha } from '@/lib/recaptcha'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { signupAction } from './signup.action'
import { SignupSchema, SignupType } from './signup.schema'

export const SignupForm = () => {
    const router = useRouter()
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [isCaptchaVerified, setIsCaptchaVerified] = React.useState<boolean>(false)

    const form = useForm<SignupType>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const mutation = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (newUser: SignupType) => {
            if (!isCaptchaVerified) {
                form.setError('root', { message: 'Please verify that you are not a robot' })
                return
            }

            const result = await signupAction(newUser)

            if (result?.serverError || !result?.data) {
                form.setError('root', { message: result?.serverError || 'An unexpected error occurred' })
                return
            }

            await signIn(
                'credentials',
                { email: newUser.email, password: newUser.password, redirect: false }
            )

            toast.success('Account created successfully')

            router.push('/setup')
        }
    })

    async function handleCaptchaSubmission(token: string | null) {
        await verifyCaptcha(token)
            .then(() => setIsCaptchaVerified(true))
            .catch(() => setIsCaptchaVerified(false))
    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(async (values) => await mutation.mutateAsync(values))}>
            <FormField
                name='email'
                control={form.control}
                disabled={form.formState.isSubmitting}
                render={(context) => (
                    <FormItem className='mb-2'>
                        <FormLabel>
                            Email
                        </FormLabel>
                        <FormControl>
                            <Input type='text' placeholder='Type your Email address' {...context.field}
                                className={`my-2 h-10 w-full rounded-none border border-background bg-background
                         px-3 py-2 shadow-md`}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name='password'
                control={form.control}
                disabled={form.formState.isSubmitting}
                render={(context) => (
                    <FormItem className='mb-2'>
                        <FormLabel>
                            Password
                        </FormLabel>
                        <FormControl>
                            <Input type='password' placeholder='Type your Password' {...context.field}
                                className={`my-2 h-10 w-full rounded-none border border-background bg-background
                                 px-3 py-2 shadow-md`}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name='confirmPassword'
                control={form.control}
                disabled={form.formState.isSubmitting}
                render={(context) => (
                    <FormItem className='mb-2'>
                        <FormLabel>
                            Password confirmation
                        </FormLabel>
                        <FormControl>
                            <Input type='password' placeholder='Type your Password' {...context.field}
                                className={`my-2 h-10 w-full rounded-none border border-background bg-background
                                 px-3 py-2 shadow-md`}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {form.formState.errors.root && <div className='mb-5 mt-2 text-xs text-red-500'>
                {form.formState.errors.root.message}
            </div>}

            <div className='mt-4 flex justify-center'>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    ref={recaptchaRef}
                    theme='dark'
                    onChange={handleCaptchaSubmission}
                />
            </div>

            <Button
                type='submit'
                className='dark mt-4 w-full rounded-none' size='lg'
                disabled={!isCaptchaVerified || form.formState.isSubmitting}
            >
                Register
                {form.formState.isSubmitting && <Loader2 className='ml-1 size-4 animate-spin' />}
            </Button>
        </form>
    </Form>)
}
