import { Prisma, PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // eslint-disable-next-line vars-on-top, no-unused-vars, no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = global.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma


export type UserWithAccounts = Prisma.UserGetPayload<{
  include: { chessAccounts: true }
}>