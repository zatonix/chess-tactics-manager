'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { LogoutButton } from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { UserWithAccounts } from '@/lib/database'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { infosHasChanged } from './check-change'
import { useInterval } from 'usehooks-ts'
import {
  createChesscomTask,
  createLichessSynchonizerTask
} from '@/lib/cloudtask'
import { getBottNeutral } from '@/lib/dicebear'

interface UserProps {
  user: UserWithAccounts
}

const MotionCard = motion(Card)

export const UserDetails = ({ user }: UserProps) => {
  const lichessAccount = user.chessAccounts.find(
    (account) => account.chessAccount.provider === 'lichess'
  )?.chessAccount
  const chesscomAccount = user.chessAccounts.find(
    (account) => account.chessAccount.provider === 'chesscom'
  )?.chessAccount

  useInterval(() => {
    infosHasChanged(user)
  }, 1000)

  return (<>
    <MotionCard
      className={cn(
        'text-white bg-foreground border-l-4 border-r-0',
        'border-t-0 border-b-0 border-primary rounded-none col-span-12 xl:col-span-9 w-full'
      )}
      animate={{ x: 0, opacity: 1 }}
      initial={{ x: -50, opacity: 0 }}
    >
      <CardHeader>
        <CardTitle>
          <div className='flex flex-row align-baseline gap-2'>
            <Avatar>
              <AvatarImage
                src={getBottNeutral(user.email ?? 'unknown')}
              />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div>
              {user.name}
              <br />
              <i className='text-sm'>{user.email}</i>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          <div className='flex w-full flex-col lg:flex-row'>
            <div className='grid h-32 grow place-items-center'>
              {lichessAccount && (
                <>
                  <span>
                    <Text as='h4'>{`Lichess.org: ${lichessAccount.username}`}</Text>
                    <i suppressHydrationWarning className='flex gap-1 justify-center'>
                      <div>
                      Last update: 
                      </div>
                      <div>
                      {lichessAccount.isFetching ? (
                        <Loader2 className='ml-1 size-4 animate-spin' />
                      ) : (
                        lichessAccount?.lastFetch?.toLocaleString() ??
                        'Never fetched'
                      )}
                      </div>
                    </i>
                  </span>
                  <Button
                    disabled={lichessAccount?.isFetching}
                    onClick={async () => {
                      await createLichessSynchonizerTask(
                        lichessAccount?.id ?? ''
                      )
                      toast.success('Synchronization with lichess.org started')
                    }}
                  >
                    Synch Lichess.org
                  </Button>
                </>
              )}
            </div>
            <div className='grid h-32 grow place-items-center'>
              {chesscomAccount && (
                <>
                  <span>
                    <Text as='h4'>{`Chess.com: ${chesscomAccount.username}`}</Text>
                    <i suppressHydrationWarning className='flex gap-1 justify-center'>
                      <div>
                      Last update: 
                      </div>
                      <div>
                      {chesscomAccount.isFetching ? (
                        <Loader2 className='ml-1 size-4 animate-spin' />
                      ) : (
                        chesscomAccount?.lastFetch?.toLocaleString() ??
                        'Never fetched'
                      )}
                      </div>
                    </i>
                  </span>

                  <Button
                    disabled={chesscomAccount?.isFetching}
                    onClick={async () => {
                      await createChesscomTask(chesscomAccount?.id ?? '')
                      toast.success('Synchronization with chess.com started')
                    }}
                  >
                    Sync Chess.com
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <LogoutButton />
      </CardContent>
    </MotionCard>
    </>
  )
}
