import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '@/pages/api/auth/[...nextauth]'
import { isEmpty, isNil } from 'lodash'
import prisma, { UserWithAccounts } from '@/lib/database'

export const checkServerSessionOrRedirect = async (checkSetup: boolean = true): Promise<UserWithAccounts | null> => {
    const session = await getServerSession(nextAuthConfig)

    if (!session || isNil(session?.user?.email)) {
        return redirect('/signin')
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
        include: {
            chessAccounts: true
        },
    })

    if (!user) {
        return redirect('/signin')
    }

    if (isEmpty(user.chessAccounts) && checkSetup) {
        return redirect('/setup')
    }

    return user
}

export const checkNotAuthenticatedOrRedirect = async () => {
    const session = await getServerSession(nextAuthConfig)

    if (session && session?.user?.email) {
       redirect('/')
    }
}
