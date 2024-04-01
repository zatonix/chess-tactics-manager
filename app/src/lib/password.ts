import { compare, hash } from 'bcryptjs'

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function isPasswordValid(
  password: string,
  hashedPassword: string
) {
  return await compare(password, hashedPassword)
}
