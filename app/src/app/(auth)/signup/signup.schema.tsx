import { z } from 'zod'

const checkPasswordStrength = (password: string) => {
    return password.match(/[a-z]/) &&
        password.match(/[A-Z]/) &&
        password.match(/[0-9]/) &&
        password.match(/[^a-zA-Z0-9]/)
}

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string()
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] }
).refine(
    (data) => checkPasswordStrength(data.password),
    {
        message: `Password strength: 1 lowercase, 1 uppercase, 1 number, 1 special character`,
        path: ['password']
    }
)

export type SignupType = z.infer<typeof SignupSchema>

export const SignupSchemaError = {
    email: 'Invalid email',
    password: 'Password must be at least 8 characters',
    confirmPassword: 'Passwords do not match',
}

export const SignupActionSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
}).refine(
    (data) => checkPasswordStrength(data.password),
    {
        message: `Invalid password`,
        path: ['password']
    }
)
