'use server'

import prisma, { UserWithAccounts } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export const infosHasChanged = async (user: UserWithAccounts) => {

    if (!user) {
      return
    }

    const accounts = await prisma.chessAccount.findMany({
      where: {
        userId: user?.id
      }
    })

    const alors = user?.chessAccounts.some((acc) =>
      accounts.some(
        (account) =>
          account.id === acc.id && (account.isFetching !== acc.isFetching || account.lastFetch !== acc.lastFetch)
      )
    ) 
    if (alors) {
        revalidatePath('/profile')
    }
  }