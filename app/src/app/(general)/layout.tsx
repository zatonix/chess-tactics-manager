import { Sidebar } from '@/components/navigation/Sidebar'
import React from 'react'

export default function GeneralLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex h-screen w-full bg-background text-white'>
            <Sidebar />
            {children}
        </div>
    )
}
