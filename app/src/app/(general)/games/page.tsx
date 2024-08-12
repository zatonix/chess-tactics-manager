import { FilterButton } from '@/components/game/filter-button'
import { LatestGamesTable } from '@/components/game/latest-games-table'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect } from '@/lib/authentication'
import prisma from '@/lib/database'
import { cn } from '@/lib/utils'

const gamesPerPage = 10

interface GameSearchParams {
  page: string
}

interface GamesPageProps {
  searchParams: GameSearchParams
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts =
    user?.chessAccounts.map((account) => account.chessAccount) || []

  const { page } = searchParams
  let pageNumber = parseInt(page, 10) || 1
  if (pageNumber < 1) {
    pageNumber = 1
  }

  const games = await prisma.game.findMany({
    where: {
      OR: [
        ...chessAccounts.map((account) => {
          return { whiteChessAccountId: account.id }
        }),
        ...chessAccounts.map((account) => {
          return { blackChessAccountId: account.id }
        })
      ]
    },
    orderBy: {
      date: 'desc'
    },
    skip: (pageNumber - 1) * gamesPerPage,
    take: gamesPerPage
  })

  const totalGames = await prisma.game.count({
    where: {
      OR: [
        ...chessAccounts.map((account) => {
          return { whiteChessAccountId: account.id }
        }),
        ...chessAccounts.map((account) => {
          return { blackChessAccountId: account.id }
        })
      ]
    }
  })

  const maxPage = Math.ceil(totalGames / gamesPerPage)

  return (
    <>
      <MotionCard
        className={cn(
          'col-span-12 h-[calc(100vh-2rem)] bg-foreground xl:col-span-6 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle className='flex w-full justify-between items-center'>
            Games
            <FilterButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LatestGamesTable
            initialGames={games}
            chessAccounts={chessAccounts}
            page={pageNumber}
            gamesPerPage={gamesPerPage}
            enabledPreview={false}
            maxPage={maxPage}
          />
        </CardContent>
      </MotionCard>
    </>
  )
}
