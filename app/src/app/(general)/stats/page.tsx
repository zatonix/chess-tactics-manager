import { nextAuthConfig } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Stats() {
    const session = await getServerSession(nextAuthConfig)
    if (!session) {
        return redirect('/signin')
    }

    return (
        <>
        Stats
        </>
    )
}
