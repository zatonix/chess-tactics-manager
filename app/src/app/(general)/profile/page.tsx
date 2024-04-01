import { nextAuthConfig } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function Profile() {
    const session = await getServerSession(nextAuthConfig)
    if (!session) {
        return redirect('/signin')
    }

    return (
        <>
        Profile
        </>
    )
}
