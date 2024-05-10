import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/forgot-password.form'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'
import { AuthImage } from '@/components/auth/AuthImage'

export default async function ForgotPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex size-full items-center justify-center border-none bg-foreground text-white'>
            <div className='flex w-full flex-col items-center justify-around lg:w-5/12'>
                <h1 className='mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight'>
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
