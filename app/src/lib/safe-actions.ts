import { getSession } from 'next-auth/react'
import { createSafeActionClient } from 'next-safe-action'

export class ActionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ActionError'
    }
}

const handleReturnedServerError = (error: Error) => {
    if (error instanceof ActionError) {
        return error.message
    }

    return 'An unexpected error occurred'
}

export const nobodyAction = createSafeActionClient({
    handleReturnedServerError
})

export const userAction = createSafeActionClient({
    handleReturnedServerError,
    middleware: async () => {
        const session = await getSession()
        if (!session || !session.user) {
            throw new ActionError('You need to be logged in to perform this action')
        }

        return session.user
    }
})

