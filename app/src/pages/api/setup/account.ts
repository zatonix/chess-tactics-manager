'use server'

import prisma from '@/lib/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { decode } from 'next-auth/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { lichessUsername, chesscomUsername }  = req.body

    if (lichessUsername !== undefined) {
    const response = await fetch(`https://lichess.org/api/users/status?ids=${lichessUsername}`)

    const data = await response.json()

    if (data.length === 0) {
      res.status(404).json({ success: false })
      return
    }
    res
      .status(200)
      .json({ success: true })
    } else if (chesscomUsername !== undefined) {

      const response = await fetch(`https://www.chess.com/member/${chesscomUsername}`)
      const data = await response.text()
      if (data.includes('Page not found')) {
        res.status(404).json({ success: false })
        return
      }

      res
        .status(200)
        .json({ success: true })
    }
  } else if (req.method === 'PUT') {
    const sessionToken = req.cookies['next-auth.session-token']

    const decodedUser = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET!,
    })

    if (!decodedUser || !decodedUser.email) {
      res.status(403).json({ success: false })
      return
    }

    const { lichessUsername, chesscomUsername }  = req.body

    await prisma.user.update({
      where: { email: decodedUser.email },
      data: {
        lichessUsername,
        chesscomUsername,
      },
    })

    res.status(200).json({ success: true })
  } else {
    res.status(400).json({ success: false })
  }
}
