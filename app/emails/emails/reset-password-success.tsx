import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import * as React from 'react'

interface ResetPasswordSuccessEmailProps {
  resetEmail?: string
  resetDate?: string
  loginLink?: string
  resetFromIp?: string
  resetFromLocation?: string
}

const baseUrl = process.env.NEXT_APP_URL

export const ResetPasswordSuccessEmail = ({
  resetEmail,
  resetDate,
  loginLink,
  resetFromIp,
  resetFromLocation,
}: ResetPasswordSuccessEmailProps) => {
  const previewText = `Reset password`

  return (
    <Html>
      <Head />
      <Preview>
        {previewText}
      </Preview>
      <Tailwind>
        <Body className='bg-[#261F27] my-auto mx-auto font-sans px-2'>
          <Container className={`border border-solid bg-[#2E252A] border-l-4 border-r-0 border-t-0 border-b-0
            border-[#AD6205] rounded my-[40px] mx-auto p-[20px] max-w-[465px]`}>
            <Section className='mt-[32px]'>
              <Img
                src={`${baseUrl}/logo.png`}
                width='65'
                height='65'
                alt='ctm-logo'
                className='my-0 mx-auto'
              />
            </Section>
            <Text className='text-white text-[14px] leading-[24px]'>
              Hello chess player,
            </Text>
            <Text className='text-white text-[14px] leading-[24px]'>
              You updated the password for your account on
              {' '}
              {resetDate}
              .
              <br />
              If this was you, then no further action is required.
              <br />
              However if you did NOT perform this password change, please reset your account password immediately.
              <br />
              Remember to use a password that is both strong and unique to your chess tactics manager account.
            </Text>
            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                className='bg-[#AD6205] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                href={loginLink}
              >
                Login to Chess Tactics Manager
              </Button>
            </Section>
            <Text className='text-white text-[14px] leading-[24px]'>
              or copy and paste this URL into your browser:
              {' '}
              <Link href={loginLink} className='text-blue-600 no-underline'>
                {loginLink}
              </Link>
            </Text>
            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
            <Text className='text-[#666666] text-[12px] leading-[24px]'>
              This invitation was intended for
              {' '}
              <span className='text-white'>
                {resetEmail}
              </span>
              . This invite was sent from
              <span className='text-white'>
                {resetFromIp}
              </span>
              {' '}
              from
              {' '}
              <span className='text-white'>
                {resetFromLocation}
              </span>
              . If you were not expecting this invitation, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPasswordSuccessEmail.PreviewProps = {
  resetDate: 'Jun 23, 2022, 4:06:00 PM',
  resetEmail: 'me@example.com',
  loginLink: 'http://localhost:3000/reset-password?token=123',
  resetFromIp: 'XXX.XXX.XXX.XXX',
  resetFromLocation: 'Paris, France',
} as ResetPasswordSuccessEmailProps

export default ResetPasswordSuccessEmail
