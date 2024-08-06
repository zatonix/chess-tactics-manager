import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { cn } from '@/lib/utils'
import { PrecisionChart } from './PrecisionChart'
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
        }),
      ]
    },
    orderBy: {
      date: 'desc'
    },
    take: 15
  })

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
          <Text as='h2'>46</Text>
        </CardHeader>
        <CardContent className='flex flex-col'>
          <CountGameChart />
        </CardContent>
      </MotionCard>

      <MotionCard
        className={cn(
          'col-span-12 h-96 bg-foreground lg:col-span-6 xl:col-span-3 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle>Average accuracy</CardTitle>
          <Text as='h2'>54.28</Text>
        </CardHeader>
        <CardContent className='flex flex-col'>
          <PrecisionChart />
        </CardContent>
      </MotionCard>

      <ChessGame />
    </div>
  )
}
