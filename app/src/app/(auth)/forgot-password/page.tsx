import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/forgot-password.form'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'
import { AuthImage } from '@/components/auth/auth-image'

export default async function ForgotPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex items-center justify-center text-white border-none size-full bg-foreground'>
            <div className='flex flex-col items-center justify-around w-full lg:w-5/12'>
                <h1 className='pb-2 mb-10 text-3xl font-semibold tracking-tight border-b scroll-m-20'>
                    Chess Tactics Manager
                </h1>
                <div className='w-3/4 text-left md:w-1/2'>
                    <ForgotPasswordForm />
                </div>
            </div>
            <AuthImage />
        </div>
    )
}
