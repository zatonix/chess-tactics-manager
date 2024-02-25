import React from 'react'
import { Session } from 'next-auth'
import { LogoutButton } from './LogoutButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserProps {
    session: Session
}

export const User = ({ session }: UserProps) => {
    if (!session.user) {
        return <p> No User </p>
    }
    return (
        <Card className={cn("text-white bg-foreground border-foreground border-l-4 border-r-0 border-t-0 border-b-0 border-primary rounded-none w-[380px]")}>
            <CardHeader>
                <Avatar>
                    <AvatarImage src={session.user.image ?? ''} alt="user-avatar" />
                    <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <CardTitle>
                    {session.user.name}
                </CardTitle>
                <CardDescription>{session.user.email}.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <LogoutButton />
            </CardContent>
        </Card>
    )
}
