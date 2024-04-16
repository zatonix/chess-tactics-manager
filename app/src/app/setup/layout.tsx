import { cn } from '@/lib/utils'
import React from 'react'

export default function SetupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex h-screen w-full items-center justify-center bg-background text-white'>
            <div className={cn('w-3/4 md:w-1/2 m-h-1/2 bg-foreground ',
            'border-l-4 border-r-0 border-t-0 border-b-0 border-primary rounded-none p-5')}>
            {children}
            </div>
        </div>
    )
}
