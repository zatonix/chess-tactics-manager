'use server'

import { headers } from 'next/headers'
import ResetPasswordEmail from '@/../emails/reset-password'
import prisma from '@/lib/database'
import { sendEmail } from '@/lib/email'
import { nobodyAction } from '@/lib/safe-actions'
import { render } from '@react-email/components'
import { nanoid } from 'nanoid'
import { ForgotPasswordSchema } from './forgot-password.schema'

export const forgotPasswordAction = nobodyAction(
    ForgotPasswordSchema,
    async (input) => {
        const headersList = headers()

        const userAgents = headersList.get('user-agent') || 'Unknown'
        const ip = headersList.get('x-real-ip') || headersList.get('x-forwarded-for') || 'Unknown'

        const user = await prisma.user.findUnique({
            where: {
                email: input.email
            },
        })

        if (!user) {
            return
        }

        await prisma.verificationToken.deleteMany({
            where: {
                userId: user.id
            },
        })

        const securedTokenId = nanoid(32)

        // create a new verification token
        await prisma.verificationToken.create({
            data: {
                token: securedTokenId,
                userId: user.id,
                expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
            },
        })

        sendEmail(input.email, 'CTM - Reset password request', render(
            ResetPasswordEmail({
                resetEmail: input.email,
                resetPasswordLink: `${process.env.NEXT_APP_URL}/reset-password?token=${securedTokenId}`,
                resetFromIp: ip,
                resetFromLocation: userAgents,
            })
        ))
    }
)
