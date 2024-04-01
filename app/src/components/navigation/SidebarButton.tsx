import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    const router = useRouter()

    return (
        <Button
            variant='link'
            onClick={() => router.push(baseUrl)}
            className={cn('w-14 h-14 text-white', active ? 'bg-active' : '')}
            size='lg'
        >
            <div className='flex flex-col justify-center items-center'>
                {icon}
                {label}
            </div>
        </Button>
    )
}
