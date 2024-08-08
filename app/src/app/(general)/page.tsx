import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { cn } from '@/lib/utils'
import { RatioVictoryChart } from './RatioVictoryChart'
import { LatestGamesTable } from './LatestGamesTable'
import prisma from '@/lib/database'
import { ChessGame } from './ChessGame'
import { CountGameChart } from './CountGameChart'

export default async function DashboardPage() {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts = user?.chessAccounts || []

  const games = await prisma.game.findMany({
    where: {
      OR: [
        ...chessAccounts.map((account) => {
          return { whiteChessAccountId: account.chessAccount.id }
        }),
        ...chessAccounts.map((account) => {
          return { blackChessAccountId: account.chessAccount.id }
        })
      ]
    },
    orderBy: {
      date: 'desc'
    },
    take: 25
  })

  // get count of games from accounts
  const totalGamesCount = await prisma.game.count({
    where: {
      OR: [
        ...chessAccounts.map((account) => {
          return { whiteChessAccountId: account.chessAccount.id }
        }),
        ...chessAccounts.map((account) => {
          return { blackChessAccountId: account.chessAccount.id }
        })
      ]
    }
  })

  const getGamesLastSixMonths = async () => {
    const results = []

    const currentDate = new Date()

    for (let i = 0; i < 6; i += 1) {
      const month = currentDate.getMonth() - i
      const year = currentDate.getFullYear()

      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)

      const gamesCount = await prisma.game.count({
        where: {
          OR: [
            ...chessAccounts.map((account) => ({
              whiteChessAccountId: account.chessAccount.id
            })),
            ...chessAccounts.map((account) => ({
              blackChessAccountId: account.chessAccount.id
            }))
          ],
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      results.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        games: gamesCount
      })
    }

    return results.reverse() 
  }

  const getWinPercentageLastSixMonths = async () => {
    const results = []
    const currentDate = new Date()
  
    for (let i = 0; i < 6; i += 1) {
      const month = currentDate.getMonth() - i
      const year = currentDate.getFullYear()
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0)
  
      const winCount = await prisma.game.count({
        where: {
          OR: [
            {
              whiteChessAccountId: {
                in: chessAccounts.map((account) => account.chessAccount.id)
              },
              winner: 'white'
            },
            {
              blackChessAccountId: {
                in: chessAccounts.map((account) => account.chessAccount.id)
              },
              winner: 'black'
            }
          ],
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
  
      const totalCount = await prisma.game.count({
        where: {
          OR: [
            {
              whiteChessAccountId: {
                in: chessAccounts.map((account) => account.chessAccount.id)
              }
            },
            {
              blackChessAccountId: {
                in: chessAccounts.map((account) => account.chessAccount.id)
              }
            }
          ],
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
  
      const winPercentage = totalCount > 0 ? (winCount / totalCount) * 100 : 0
  
      results.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        precision: Number(winPercentage.toFixed(2)),
      })
    }
  
    return results.reverse() 
  }

  const victoryRatioData = await getWinPercentageLastSixMonths()
  const victoryRatioAverage = victoryRatioData.reduce((acc, curr) => acc + curr.precision, 0) / victoryRatioData.length

  return (
    <div className='grid size-full grid-flow-row-dense grid-cols-12 gap-4'>
      <MotionCard
        className={cn(
          'col-span-12 h-96 bg-foreground xl:col-span-6 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle>Last games</CardTitle>
        </CardHeader>
        <CardContent>
          <LatestGamesTable games={games} />
        </CardContent>
      </MotionCard>

      <MotionCard
        className={cn(
          'col-span-12 h-96 bg-foreground lg:col-span-6 xl:col-span-3 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle>Number of games</CardTitle>
          <Text as='h3'>{totalGamesCount}</Text>
        </CardHeader>
        <CardContent className='flex flex-col'>
          <CountGameChart data={await getGamesLastSixMonths()} />
        </CardContent>
      </MotionCard>

      <MotionCard
        className={cn(
          'col-span-12 h-96 bg-foreground lg:col-span-6 xl:col-span-3 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle>Victory Ratio</CardTitle>
          <Text as='h3'>{victoryRatioAverage}%</Text>
        </CardHeader>
        <CardContent className='flex flex-col'>
          <RatioVictoryChart data={victoryRatioData} />
        </CardContent>
      </MotionCard>

      <ChessGame />
    </div>
  )
}
