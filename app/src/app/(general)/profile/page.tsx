import { checkServerSessionOrRedirect } from '@/lib/authentication'

export default async function ProfilePage() {
    await checkServerSessionOrRedirect()

    return (
        <>
        Profile
        </>
    )
}
