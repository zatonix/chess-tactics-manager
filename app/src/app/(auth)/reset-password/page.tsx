import { AuthImage } from '@/components/auth/AuthImage'
import { ResetPasswordForm } from '@/app/(auth)/reset-password/reset-password.form'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'

export default async function ResetPasswordPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex min-h-screen w-full items-center justify-center border-none bg-foreground text-white'>
            <div className='flex w-full flex-col items-center justify-around lg:w-5/12'>
                <h1 className='mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
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
