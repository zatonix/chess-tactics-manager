import { AuthImage } from '@/components/auth/auth-image'
import { ResetPasswordForm } from '@/app/(auth)/reset-password/reset-password.form'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'

export default async function ResetPasswordPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex items-center justify-center w-full min-h-screen text-white border-none bg-foreground'>
            <div className='flex flex-col items-center justify-around w-full lg:w-5/12'>
                <h1 className='pb-2 mb-10 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0'>
                    Reset password
                </h1>
                <div className='w-3/4 text-left md:w-1/2'>
                    <ResetPasswordForm />
                </div>
            </div>
            <AuthImage />
        </div>
    )
}
