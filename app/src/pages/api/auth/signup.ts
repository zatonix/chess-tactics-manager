import { hashPassword } from '@/lib/password'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const newUser = req.body

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
          email: newUser.email,
        }
    })

    if (userExists) {
      res.status(422).json({
        success: false,
        message: 'A user with the same email already exists',
        userExists: true,
      })
      return
    }

    // Hash Password
    newUser.password = await hashPassword(newUser.password)

    // Store new user
    await prisma.user.create({
      data: newUser,
    })

    res
      .status(201)
      .json({ success: true, message: 'User signed up successfuly' })
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' })
  }
}
