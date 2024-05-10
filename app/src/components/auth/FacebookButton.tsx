'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '../ui/button'

export const FacebookButton = () => {
    return (
        <Button
            type='button'
            onClick={() => signIn('facebook')}
            className='mb-2 me-2 inline-flex w-full items-center rounded-none
                      border-none bg-[#2f69f3] px-5 py-6 text-center text-sm font-medium
                      text-white hover:bg-[#2f69f3]/80'
        >
            <Image src='/facebook-logo.svg' alt='Facebook'
                width={20} height={20} color='white' className='me-1 invert' />
            Continue with Facebook
        </Button>
    )
}
