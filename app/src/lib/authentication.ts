import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '@/pages/api/auth/[...nextauth]'
import { User } from '@prisma/client'
import { isNil } from 'lodash'
import prisma from '@/lib/database'

export const checkServerSessionOrRedirect = async (checkSetup: boolean = true): Promise<User | undefined> => {
    const session = await getServerSession(nextAuthConfig)

    if (!session || isNil(session?.user?.email)) {
        return redirect('/signin')
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        }
    })

    if (!user) {
        return redirect('/signin')
    }

    if (isNil(user.lichessUsername) && isNil(user.chesscomUsername) && checkSetup) {
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
