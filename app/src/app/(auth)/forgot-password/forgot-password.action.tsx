'use server'

import { headers } from 'next/headers'
import ResetPasswordEmail from '@/../emails/reset-password'
import prisma from '@/lib/database'
import { sendEmail } from '@/lib/email'
import { nobodyAction } from '@/lib/safe-actions'
import { render } from '@react-email/components'
import { nanoid } from 'nanoid'
import { ForgotPasswordSchema } from './forgot-password.schema'

export const forgotPasswordAction = nobodyAction
    .schema(ForgotPasswordSchema)
    .action(async ({ parsedInput }) => {
        const headersList = headers()

        const userAgents = headersList.get('user-agent') || 'Unknown'
        const ip = headersList.get('x-real-ip') || headersList.get('x-forwarded-for') || 'Unknown'

        const user = await prisma.user.findUnique({
            where: {
                email: parsedInput.email
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

        sendEmail(parsedInput.email, 'CTM - Reset password request', render(
            ResetPasswordEmail({
                resetEmail: parsedInput.email,
                resetPasswordLink: `${process.env.NEXT_APP_URL}/reset-password?token=${securedTokenId}`,
                resetFromIp: ip,
                resetFromLocation: userAgents,
            })
        ))
    })
