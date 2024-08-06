'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { LogoutButton } from '../../../components/auth/LogoutButton'
import { triggerLichessSync } from '@/lib/chess/lichess'
import { Button } from '@/components/ui/button'
import { UserWithAccounts } from '@/lib/database'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { infosHasChanged } from './check-change'
import { useInterval } from 'usehooks-ts'

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

  useInterval(
    () => {
      infosHasChanged(user)
    },
    1000
  )
  
  return (
    <MotionCard
      className={cn(
        'text-white bg-foreground border-l-4 border-r-0',
        'border-t-0 border-b-0 border-primary rounded-none w-[380px]'
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
          {lichessAccount && (
            <span className='flex flex-col'>
              <span>{`Lichess Username: ${lichessAccount.username}`}</span>
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
          <br />
          {chesscomAccount && (
            <span className='flex flex-col'>
              <span>{`Lichess Username: ${chesscomAccount.username}`}</span>
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
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Button
          disabled={lichessAccount?.isFetching}
          onClick={async () => {
            await triggerLichessSync(lichessAccount?.id ?? '')
            toast.success('Synchronization started')
          }}
        >
          Synchronize Lichess Games
        </Button>
        <LogoutButton />
      </CardContent>
    </MotionCard>
  )
}
