import { SetupForm } from '@/components/setup/SetupForm'
import { checkServerSessionOrRedirect } from '@/lib/authentication'

export default async function SetupPage() {
    await checkServerSessionOrRedirect(false)

    return (
        <>
            <h1 className='mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                Setup
            </h1>
            <p>
                Welcome to Chess Tactics Manager !
                Here you can set up your chess account.
            </p>
            <SetupForm />
        </>
    )
}
