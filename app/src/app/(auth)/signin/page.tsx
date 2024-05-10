import { AuthImage } from '@/components/auth/AuthImage'
import { FacebookButton } from '@/components/auth/FacebookButton'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { SigninForm } from '@/app/(auth)/signin/signin.form'
import { Separator } from '@/components/ui/separator'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'
import Link from 'next/link'

export default async function SignInPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex min-h-screen w-full items-center justify-center border-none bg-foreground text-white'>
            <AuthImage />
            <div className='flex w-full flex-col items-center justify-around lg:w-5/12'>
                <h1 className='mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                    Chess Tactics Manager
                </h1>
                <div className='w-3/4 text-left md:w-1/2'>
                    <SigninForm />
                    <Separator className='my-12' />
                    <div className='flex flex-col items-center justify-center gap-2'>
                            <GoogleButton />
                            <FacebookButton />
                        <p className='mt-10 text-sm'>
                            Don’t have an account?
                            <span className='ml-1 text-primary hover:underline'>
                                <Link href='/signup'>
                                    Sign up now
                                </Link>
                            </span>
                        </p>
                    </div>
                    <div className='mt-5 text-center'>
                        <p className='mt-10 text-xs'>
                            © Chess Tactics Manager 2024
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
