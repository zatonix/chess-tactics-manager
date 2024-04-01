import { SignupForm } from '@/components/auth/SignupForm'
import { nextAuthConfig } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SignIn() {
    const session = await getServerSession(nextAuthConfig)
    if (session) {
        return redirect('/')
    }

    return (
        <div className='w-full min-h-screen bg-foreground flex text-white items-center justify-center border-none'>
            <div className='flex flex-col justify-around items-center w-full lg:w-5/12'>
                <h1 className='scroll-m-20 border-b pb-2 mb-10 text-3xl font-semibold tracking-tight first:mt-0'>
                    Chess Tactics Manager
                </h1>
                <h2 className='text-2xl font-semibold mb-10'>
                    Create account
                </h2>
                <div className='w-1/2 text-left'>
                    <SignupForm />
                    <p className='text-sm text-center mt-10'>
                        Already have an account?
                        <span className='text-primary ml-1 hover:underline'>
                            <Link href='/signin'>
                                Sign In
                            </Link>
                        </span>
                    </p>
                </div>
            </div>
            <Image
                src='/login.jpg' alt='background'
                width={1920} height={1080}
                className='object-cover object-center h-screen w-7/12 hidden lg:block'
            />
        </div>
    )
}
