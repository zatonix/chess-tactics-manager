import { updateAccountStatus } from './account'
import { getChesscomArchives, getGamesFromArchive, getLastArchiveToFetch } from './chesscom'
import prisma from './prisma'
import { extractHeaderFromPgn, formatEcoUrl, getClocksFromPgn, getMovesFromPgn, transcodeResultStatus } from './utils'

export const updateChesscomAccount = async (accountId: string) => {
    console.log('Updating chesscom account', accountId)

    const account = await prisma.chessAccount.findUnique({
      where: {
        id: accountId
      }
    })
  
    if (!account) {
      console.log('Account not found')
      return null
    }
  
    updateAccountStatus(accountId, true)
  
    const archives = await getChesscomArchives(account.username.trim())
    
    if (archives.length === 0) {
      console.log('No archives found')
      return null
    }

    const lastArchiveToFetch = await getLastArchiveToFetch(archives, account.lastFetch)
    
    console.log('Last archive to fetch', lastArchiveToFetch)
    const archivesToFetch = archives.slice(archives.indexOf(lastArchiveToFetch)).reverse()

    const gamesId = await prisma.game.findMany({
      where: {
        OR: [
          { whiteChessAccountId: accountId },
          { blackChessAccountId: accountId }
        ]
      },
      select: {
        id: true
      }
    })

    const gamesIdSet = new Set(gamesId.map(game => game.id))

    for (const archive of archivesToFetch) {
      const games = await getGamesFromArchive(archive)
      console.log(`Fetched ${games.length} games for archive ${archive}`)

      for (const game of games) {
        if (game.rules !== 'chess') {
          continue
        }

        if (game.white.username !== account.username && game.black.username !== account.username) {
          throw new Error('Account not found in game')
        }

        if (!game.pgn) {
          throw new Error('PGN not found in game')
        }
        
        const link = extractHeaderFromPgn(game.pgn, 'Link')

        if (!link) {
          throw new Error('Link not found in PGN')
        }

        const gameId = link.split('/').pop() 

        if (gameId && gamesIdSet.has(gameId)) {
          continue
        }

        const ecoUrl = extractHeaderFromPgn(game.pgn, 'ECOUrl')
        const result = extractHeaderFromPgn(game.pgn, 'Result')
        const winner = result === '1-0' ? 'white' : result === '0-1' ? 'black' : 'draw'
        const status = transcodeResultStatus(winner === 'white' ? game.black.result : game.white.result)
        const opening = formatEcoUrl(ecoUrl ?? '')
        const clocks = getClocksFromPgn(game.pgn)
        const moves = getMovesFromPgn(game.pgn)
        
        await prisma.game.upsert({
          where: { id: gameId },
          update: {
            whiteChessAccountId: game.white.username === account.username ? accountId : undefined,
            blackChessAccountId: game.black.username === account.username ? accountId : undefined,
          },
          create: {
            id: gameId,
            whitePlayer: game.white.username,
            whiteChessAccountId: game.white.username === account.username ? accountId : null,
            whiteRating: game.white.rating,
            blackPlayer: game.black.username,
            blackChessAccountId: game.black.username === account.username ? accountId : null,
            blackRating: game.black.rating,
            date: new Date(game.end_time * 1000),
            pgn: moves,
            rated: game.rated,
            category: game.time_class,
            clocks,
            opening,
            status,
            winner
          }
        })
      }
    }

    console.log('Finished updating chesscom account', accountId)
    updateAccountStatus(accountId, false)
  }
  