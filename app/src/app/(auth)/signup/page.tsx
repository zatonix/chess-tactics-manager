import { AuthImage } from '@/components/auth/AuthImage'
import { SignupForm } from '@/app/(auth)/signup/signup.form'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'
import Link from 'next/link'

export default async function SignupPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex min-h-screen w-full items-center justify-center border-none bg-foreground text-white'>
            <div className='flex w-full flex-col items-center justify-around lg:w-5/12'>
                <h1 className='mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                    Chess Tactics Manager
                </h1>
                <h2 className='mb-10 text-2xl font-semibold'>
                    Create account
                </h2>
                <div className='w-3/4 text-left md:w-1/2'>
                    <SignupForm />
                    <p className='mt-10 text-center text-sm'>
                        Already have an account?
                        <span className='ml-1 text-primary hover:underline'>
                            <Link href='/signin'>
                                Sign In
                            </Link>
                        </span>
                    </p>
                </div>
            </div>
            <AuthImage />
        </div>
    )
}
