import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth, { NextAuthOptions } from 'next-auth'

import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { isPasswordValid } from '@/lib/password'

const prisma = new PrismaClient()

export const nextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: {  label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          }
        })

        if (user && await isPasswordValid(credentials.password, user?.password ?? '')) {
          return user
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions

export default NextAuth(nextAuthConfig)
