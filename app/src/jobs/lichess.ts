import { eventTrigger } from '@trigger.dev/sdk'
import { client } from '@/trigger'
import { updateLichessAccount } from '@/lib/chess/lichess'

client.defineJob({
  id: 'lichess.sync',
  name: 'Synchronize Lichess games',
  version: '0.0.1',
  trigger: eventTrigger({
    name: 'lichess.sync',
  }),
  // eslint-disable-next-line no-unused-vars
  run: async (payload, io, ctx) => {
    await io.logger.info(
      `✨ Starting Lichess synchronization for account ${payload.accountId} ✨`
    )
    await updateLichessAccount(payload.accountId)
    await io.logger.info(
      '✨ Synchronization successfuly finished ✨'
    )
  },
})