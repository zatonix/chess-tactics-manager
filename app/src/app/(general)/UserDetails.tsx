'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { LogoutButton } from '../../components/auth/LogoutButton'
import { User } from '@prisma/client'

interface UserProps {
    user: User
}

const MotionCard = motion(Card)

export const UserDetails = ({ user }: UserProps) => {

    return (
        <MotionCard className={cn('text-white bg-foreground border-l-4 border-r-0',
            'border-t-0 border-b-0 border-primary rounded-none w-[380px]')}
            animate={{ x: 0, opacity: 1 }}
            initial={{ x: -50, opacity: 0 }}
        >
            <CardHeader>
                <CardTitle>
                    <div className='flex flex-row gap-2 align-baseline '>
                        <Avatar>
                            <AvatarImage src={user.image ?? ''} alt='user-avatar' />
                            <AvatarFallback>
                                Avatar
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            {user.name}
                            <br />
                            <i className='text-sm'>
                                {user.email}
                            </i>
                        </div>
                    </div>
                </CardTitle>
                <CardDescription>
                    {user.lichessUsername && <span>
                        {`Lichess Username: ${user.lichessUsername}`}
                    </span>}
                    <br/>
                    {user.chesscomUsername && <span>
                        {`Chess.com Username: ${user.chesscomUsername}`}
                    </span>}
                </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
                <LogoutButton />
            </CardContent>
        </MotionCard>
    )
}
