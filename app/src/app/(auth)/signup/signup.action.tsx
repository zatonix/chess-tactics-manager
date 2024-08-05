'use server'

import prisma from '@/lib/database'
import { ActionError, nobodyAction } from '@/lib/safe-actions'
import { hashPassword } from '@/lib/password'
import { SignupActionSchema } from './signup.schema'

export const signupAction = nobodyAction
    .schema(SignupActionSchema)
    .action(async ({ parsedInput }) => {
        const newUser = parsedInput
        const userExists = await prisma.user.findUnique({
            where: {
                email: newUser.email,
            }
        })

        if (userExists) {
            throw new ActionError('A user with the same email already exists')
        }

        newUser.password = await hashPassword(newUser.password)

        await prisma.user.create({
            data: newUser,
        })

        return { success: true }
    }
)
