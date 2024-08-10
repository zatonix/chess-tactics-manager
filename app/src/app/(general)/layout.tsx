import { Sidebar } from '@/components/navigation/sidebar'
import React from 'react'

export default function GeneralLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='text-white size-full'>
            <Sidebar />
            <main className='min-h-screen px-4 py-20 md:px-20 md:py-4 md:pr-4'>
            {children}
            </main>
        </div>
    )
}
