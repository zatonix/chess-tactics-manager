'use server'

export async function verifyCaptcha(token: string | null) {
    console.log(process.env.RECAPTCHA_SECRET_KEY)
    const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
        { method: 'POST' }
    )
    const data = await res.json()
    if (data.success) {
        return 'success'
    } else {
        throw new Error('Failed Captcha')
    }
}
