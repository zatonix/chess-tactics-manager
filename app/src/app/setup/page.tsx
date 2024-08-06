import { SetupForm } from '@/components/setup/SetupForm'
import { checkServerSessionOrRedirect } from '@/lib/authentication'

export default async function SetupPage() {
    await checkServerSessionOrRedirect(false)

    return (
        <>
            <h1 className='pb-2 mb-10 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0'>
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
