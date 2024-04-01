import { Sidebar } from '@/components/navigation/Sidebar'
import React from 'react'

export default function GeneralLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='w-full h-screen flex bg-background text-white'>
            <Sidebar />
            {children}
        </div>
    )
}
