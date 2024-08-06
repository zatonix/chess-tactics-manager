'use server'

import prisma from '@/lib/database'
import { createLichessSynchonizerTask } from '@/lib/cloudtask'

export const triggerLichessSync = async (accountId: string) => {
  console.log('Triggering lichess sync for', accountId)

  await prisma.chessAccount.update({
    where: {
      id: accountId
    },
    data: {
      isFetching: true
    }
  })

  await createLichessSynchonizerTask(accountId)
}
