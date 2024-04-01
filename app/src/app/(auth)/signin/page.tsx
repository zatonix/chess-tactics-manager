import { AppleButton } from '@/components/auth/AppleButton'
import { CredentialsForm } from '@/components/auth/CredentialsForm'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { Separator } from '@/components/ui/separator'
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
        <>
            <div className='w-full min-h-screen bg-foreground flex text-white items-center justify-center border-none'>
                <Image
                    src='/login.jpg' alt='background'
                    width={1920} height={1080}
                    className='object-cover object-center h-screen w-7/12 hidden lg:block'
                />
                <div className='flex flex-col justify-around items-center w-full lg:w-5/12'>
                    <h1 className='scroll-m-20 border-b pb-2 mb-10 text-3xl font-semibold tracking-tight first:mt-0'>
                        Chess Tactics Manager
                    </h1>
                    <div className='w-1/2 text-left'>
                        <CredentialsForm />
                        <Separator className='mt-12 mb-12' />
                        <div className='flex items-center justify-center flex-col gap-2'>
                            <GoogleButton />
                            <AppleButton />
                            <p className='text-sm mt-10'>
                                Don’t have an account?
                                <span className='text-primary ml-1 hover:underline'>
                                    <Link href='/signup'>
                                        Sign up now
                                    </Link>
                                </span>
                            </p>
                        </div>
                        <div className='text-center mt-5'>
                            <p className='text-xs mt-10'>
                                © Chess Tactics Manager 2024
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
