import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect } from '@/lib/authentication'
import prisma from '@/lib/database'
import { cn } from '@/lib/utils'
import { ChallengeBadge } from './challenge-badge'

export default async function StatsPage() {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts =
    user?.chessAccounts.map((account) => account.chessAccount) || []

  const openings = await prisma.game.groupBy({
    _count: {
      _all: true
    },
    where: {
      OR: [
        {
          AND: [
            {
              whiteChessAccountId: {
                in: chessAccounts.map((account) => account.id)
              }
            },
            { winner: 'white' }
          ]
        },
        {
          AND: [
            {
              blackChessAccountId: {
                in: chessAccounts.map((account) => account.id)
              }
            },
            { winner: 'black' }
          ]
        }
      ]
    },
    by: ['opening']
  })

  const getTotalGamesFromOpening = (commonOpening: string) => {
    return openings
      .filter((opening) =>
        opening.opening.toLowerCase().includes(commonOpening)
      )
      .reduce((acc, curr) => acc + curr._count._all, 0)
  }

  const challenges = [
    {
      name: 'Sicilian Defense',
      progress: getTotalGamesFromOpening('sicilian'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'French Defense',
      progress: getTotalGamesFromOpening('french'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Caro-Kann Defense',
      progress: getTotalGamesFromOpening('kann'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'King\'s Indian Defense',
      progress: getTotalGamesFromOpening('king\'s indian'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Queen\'s Gambit',
      progress: getTotalGamesFromOpening('queen\'s gambit'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Ruy Lopez',
      progress: getTotalGamesFromOpening('lopez'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Nimzo-Indian Defense',
      progress: getTotalGamesFromOpening('nimzo'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Scotch Game',
      progress: getTotalGamesFromOpening('scotch'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Italian Game',
      progress: getTotalGamesFromOpening('italian'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Philidor Defense',
      progress: getTotalGamesFromOpening('philidor'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Pirc Defense',
      progress: getTotalGamesFromOpening('pirc'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Alekhine Defense',
      progress: getTotalGamesFromOpening('alekhine'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Benoni Defense',
      progress: getTotalGamesFromOpening('benoti'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Dutch Defense',
      progress: getTotalGamesFromOpening('dutch'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'English Opening',
      progress: getTotalGamesFromOpening('english'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Grünfeld Defense',
      progress: getTotalGamesFromOpening('nfeld'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Modern Defense',
      progress: getTotalGamesFromOpening('modern'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Petrov Defense',
      progress: getTotalGamesFromOpening('petrov'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Vienna Game',
      progress: getTotalGamesFromOpening('vienna'),
      total: [10, 50, 100, 1000]
    },
    {
      name: 'Two Knights Defense',
      progress: getTotalGamesFromOpening('two knights'),
      total: [10, 50, 100, 1000]
    }
  ]

  return (
    <MotionCard
      className={cn(
        'col-span-12 bg-foreground xl:col-span-6 p-2 text-white rounded-none border-none'
      )}
    >
      <CardHeader>
        <CardTitle className='flex w-full justify-between items-center'>
          Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='pl-4'>Openings</AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-8 gap-8 justify-center align-baseline m-6'>
                {challenges.map((challenge, index) => (
                  <ChallengeBadge
                    key={index}
                    name={challenge.name}
                    progress={challenge.progress}
                    total={challenge.total}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </MotionCard>
  )
}
