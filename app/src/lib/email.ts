import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (email: string, subject: string, html: string) => {
  return await resend.emails.send({
    from: process.env.RESEND_MAIL_ADDRESS!,
    to: email,
    subject,
    html,
  })
}
