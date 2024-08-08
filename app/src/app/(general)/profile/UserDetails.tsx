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
import { LogoutButton } from '../../../components/auth/LogoutButton'
import { Button } from '@/components/ui/button'
import { UserWithAccounts } from '@/lib/database'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { infosHasChanged } from './check-change'
import { useInterval } from 'usehooks-ts'
import { createChesscomTask, createLichessSynchonizerTask } from '@/lib/cloudtask'

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

  return (
    <MotionCard
      className={cn(
        'text-white bg-foreground border-l-4 border-r-0',
        'border-t-0 border-b-0 border-primary rounded-none w-1/2'
      )}
      animate={{ x: 0, opacity: 1 }}
      initial={{ x: -50, opacity: 0 }}
    >
      <CardHeader>
        <CardTitle>
          <div className='flex flex-row align-baseline gap-2'>
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`}
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
            <div className='card bg-base-300 rounded-box grid h-32 flex-grow place-items-center'>
              {lichessAccount && (
                <span className='flex flex-col'>
                 <Text as='h4'>{`Lichess.org: ${lichessAccount.username}`}</Text>
                  <i suppressHydrationWarning>
                    Last update:{' '}
                    {lichessAccount.isFetching ? (
                      <Loader2 className='ml-1 size-4 animate-spin' />
                    ) : (
                      lichessAccount?.lastFetch?.toLocaleString() ??
                      'Never fetched'
                    )}
                  </i>
                </span>
              )}
              <Button
                disabled={lichessAccount?.isFetching}
                onClick={async () => {
                  await createLichessSynchonizerTask(lichessAccount?.id ?? '')
                  toast.success('Synchronization started')
                }}
              >
                Synch Lichess.org
              </Button>
            </div>
            <div className='card bg-base-300 rounded-box grid h-32 flex-grow place-items-center'>
              {chesscomAccount && (
                <span className='flex flex-col'>
                  <Text as='h4'>{`Chess.com: ${chesscomAccount.username}`}</Text>
                  <i suppressHydrationWarning>
                    Last update:{' '}
                    {chesscomAccount.isFetching ? (
                      <Loader2 className='ml-1 size-4 animate-spin' />
                    ) : (
                      chesscomAccount?.lastFetch?.toLocaleString() ??
                      'Never fetched'
                    )}
                  </i>
                </span>
              )}
              <Button
                disabled={chesscomAccount?.isFetching}
                onClick={async () => {
                  await createChesscomTask(chesscomAccount?.id ?? '')
                  toast.success('Synchronization started')
                }}
              >
                Sync Chess.com
              </Button>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <LogoutButton />
      </CardContent>
    </MotionCard>
  )
}
