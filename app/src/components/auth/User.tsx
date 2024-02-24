import React from 'react'
import { Session } from 'next-auth'
import { LogoutButton } from './LogoutButton'

interface UserProps {
    session: Session
}

export const User = ({ session }: UserProps) => {
    if (!session.user) {
        return <p> No User </p>
    }
    return (
        <div className="card w-96 bg-primary text-primary-content">
            <div className="card-body">
                <div className="avatar">
                    <div className="w-24 rounded-xl">
                        <img src={session.user.image ?? ''} />
                    </div>
                </div>
                <h2 className="card-title">{session.user.name}</h2>
                <p>{session.user.email}</p>
                <div className="card-actions justify-end">
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}
