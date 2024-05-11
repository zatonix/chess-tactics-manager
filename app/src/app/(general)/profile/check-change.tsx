'use server'

import prisma, { UserWithAccounts } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export const infosHasChanged = async (user: UserWithAccounts) => {
  if (!user) {
    return
  }

  const accounts = await prisma.chessAccount.findMany({
    where: {
      userId: user.id
    }
  })

  const hasChanged = user.chessAccounts.some((currentAccount) =>
    accounts.some(
      (account) =>
        account.id === currentAccount.id &&
        (account.isFetching !== currentAccount.isFetching ||
          account.lastFetch?.toUTCString() !==
            currentAccount.lastFetch?.toUTCString())
    )
  )

  if (hasChanged) {
    revalidatePath('/profile')
  }
}
