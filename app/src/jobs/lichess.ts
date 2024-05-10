import { eventTrigger } from '@trigger.dev/sdk'
import { client } from '@/trigger'

import prisma from '@/lib/database'

client.defineJob({
  id: 'lichess.sync',
  name: 'Synchronize Lichess games',
  version: '0.0.1',
  trigger: eventTrigger({
    name: 'lichess.sync'
  }),
  run: async (payload, io) => {
    await io.logger.info(
      `✨ Starting Lichess synchronization for account ${payload.accountId} ✨`
    )
    const account = await io.runTask('get-account', async () => {
      return prisma.chessAccount.findUnique({
        where: {
          id: payload.accountId
        }
      })
    })

    const gamesIds = await io.runTask('get-games', async () => {
      return prisma.game.findMany({
        where: {
          OR: [
            {
              whiteChessAccountId: payload.accountId
            },
            {
              blackChessAccountId: payload.accountId
            }
          ]
        },
        select: {
          id: true
        }
      })
    })

    if (!account) {
      await io.logger.error('Account not found')
      return
    }

    await io.runTask(`update-account-fetching`, async () => {
      return prisma.chessAccount.update({
        where: {
          id: account.id
        },
        data: {
          isFetching: true
        }
      })
    })

    await io.logger.info(`Fetching Lichess games for ${account.username}`)

    const games = await io.runTask(
      'fetch-lichess-games',
      async (): Promise<any> => {
        const response = await fetch(
          `https://lichess.org/api/games/user/${account.username}?clocks=true&opening=true&max=100`,
          {
            headers: {
              Accept: 'application/x-ndjson'
            }
          }
        )
        const responseText = await response.text()
        return (responseText.match(/.+/g) ?? []).map((text) => JSON.parse(text))
      }
    )

    const gamesIdsSet = new Set(gamesIds.map((game) => game.id))

    for (const game of games) {
      const gameExist = gamesIdsSet.has(game.id)

      if (gameExist) {
        console.log('Game already exists')
        continue
      }

      await io.runTask(`create-or-update-${game.id}`, async () => {
        const whitePlayer = game.players.white
        const blackPlayer = game.players.black

        if (!whitePlayer?.user || !blackPlayer?.user) {
          console.log('Skipping game', game.id)
          return
        }

        await prisma.game.create({
          data: {
            id: game.id,
            pgn: game.moves,
            whitePlayer: whitePlayer.user.id,
            whiteChessAccountId:
              whitePlayer.user.id === account.username ? account.id : null,
            whiteRating: whitePlayer.rating,
            blackPlayer: blackPlayer.user.id,
            blackChessAccountId:
              blackPlayer.user.id === account.username ? account.id : null,
            blackRating: blackPlayer.rating,
            winner: game.winner || 'draw',
            status: game.status,
            rated: game.rated,
            category: game.speed,
            clocks: game.clocks,
            opening: game.opening.name,
            date: new Date(game.createdAt)
          }
        })
        console.log('Game created')
      })
    }

    await io.runTask(`update-account-finished`, async () => {
      return prisma.chessAccount.update({
        where: {
          id: account.id
        },
        data: {
          isFetching: false,
          lastFetch: new Date()
        }
      })
    })

    await io.logger.info('✨ Synchronization successfuly finished ✨')
  }
})
