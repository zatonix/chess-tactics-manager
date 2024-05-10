import { z } from 'zod'

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
})

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>
