import { z } from 'zod'

export const CredentialSchema = z.object({
    email: z.string(),
    password: z.string(),
    remember: z.boolean()
})

export type CredentialsType = z.infer<typeof CredentialSchema>
