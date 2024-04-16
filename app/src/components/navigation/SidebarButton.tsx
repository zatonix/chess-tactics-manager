import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SidebarButtonProps {
    label: string
    baseUrl: string
    icon: React.ReactNode
    active: boolean
}

export const SidebarButton = ({
    label,
    baseUrl,
    icon,
    active
}: SidebarButtonProps) => {
    return (<Link href={baseUrl}>
        <Button
            variant='link'
            className={cn('w-14 h-14 p-9 text-white hover:no-underline', active ? 'bg-active' : '')}
            size='lg'
        >
            <div className='flex flex-col items-center justify-center text-xs'>
                {icon}
                {label}
            </div>
        </Button>
    </Link>
    )
}
