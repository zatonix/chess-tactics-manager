import { checkServerSessionOrRedirect } from '@/lib/authentication'

export default async function StatsPage() {
    await checkServerSessionOrRedirect()

    return (
        <>
        Challenges
        </>
    )
}
