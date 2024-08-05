import { getSession } from 'next-auth/react'
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from 'next-safe-action'

export class ActionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ActionError'
    }
}

const handleReturnedServerError = (e: Error) => {
    if (e instanceof ActionError) {
        return e.message
    }

  return DEFAULT_SERVER_ERROR_MESSAGE
}

export const nobodyAction = createSafeActionClient({
    handleReturnedServerError
  }
)

export const userAction = createSafeActionClient({
    handleReturnedServerError
}).use(async ({ next }) => {
    const session = await getSession()
    if (!session || !session.user) {
        throw new ActionError('You need to be logged in to perform this action')
    }

    return next({ ctx: session.user })
})

