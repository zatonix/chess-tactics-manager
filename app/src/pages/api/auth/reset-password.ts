import prisma from '@/lib/database'
import { hashPassword } from '@/lib/password'
import { render } from '@react-email/components'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import ResetPasswordEmail from '@/../emails/reset-password'
import ResetPasswordSuccessEmail from '@/../emails/reset-password-success'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email } = req.body
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return res.status(422).json({ messge: 'User doesn\'t exists' })
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

      const { error } = await resend.emails.send({
        from: process.env.RESEND_MAIL_ADDRESS!,
        to: email,
        subject: 'CTM - Reset password request',
        html: render(
          ResetPasswordEmail({
            resetEmail: email,
            resetPasswordLink: `${process.env.NEXT_APP_URL}/reset-password?token=${securedTokenId}`,
            resetFromIp: req.socket.remoteAddress || '',
            resetFromLocation: req.headers['user-agent'] || '',
          })
        ),
      })

      if (error) {
        return res.status(400).send({ message: error })
      }
    } catch (error: any) {
      return res.status(400).send({ message: error.message })
    }

    res.status(200).json({ success: true })
  } else if (req.method === 'PUT') {
    const { tokenId, password } = req.body

    // Get token from DB
    const token = await prisma.verificationToken.findUnique({ where: { token: tokenId } })

    if (!token || (token.expires && token.expires < new Date())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      })
    }

    // Return user
    const user = await prisma.user.findUnique({ where: { id: token.userId } })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      })
    }

    // Hash password before resetting
    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    const { error } = await resend.emails.send({
      from: process.env.RESEND_MAIL_ADDRESS!,
      to: user.email ?? '',
      subject: 'CTM - Your password was recently updated',
      html: render(
        ResetPasswordSuccessEmail({
          resetEmail: user.email ?? '',
          resetDate: new Date().toDateString(),
          loginLink: `${process.env.NEXT_APP_URL}/login`,
          resetFromIp: req.socket.remoteAddress || '',
          resetFromLocation: req.headers['user-agent'] || '',
        })
      ),
    })

    if (error) {
      return res.status(400).send({ message: error })
    }

    // Delete token so it won't be used twice
    const deleteToken = await prisma.verificationToken.delete({
      where: { token: tokenId },
    })

    if (!deleteToken) {
      res.status(403).end()
    }

    res
      .status(200)
      .json({ seccuess: true, message: 'Password is reset successfuly' })
  } else {
    res.status(400).json({ success: false, message: 'Bad request' })
  }
}
