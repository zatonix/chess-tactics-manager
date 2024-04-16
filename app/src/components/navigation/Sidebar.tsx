
'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { LayoutDashboard, AreaChart, UserCog } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarButton } from './SidebarButton'
import Link from 'next/link'

export const Sidebar = () => {
    const pathname = usePathname()

    const activeMenu = useMemo(() => {
        if (pathname?.startsWith('/stats')) {
            return 'stats'
        } else if (pathname?.startsWith('/profile')) {
            return 'profile'
        }
        return 'home'
    }, [pathname])

    return (
        <div className='w-20 min-w-20 bg-foreground shadow-lg'>
            <div className='flex h-2/3 flex-col items-center justify-between'>
                <Link href='/'>
                    <Image src='/logo.png' width='310' height='310' alt='logo' className='m-4 w-12 hover:scale-110' />
                </Link>
                <div className='flex flex-col items-center justify-around gap-12'>
                    <SidebarButton
                        label='Dashboard' baseUrl='/' icon={<LayoutDashboard />} active={activeMenu === 'home'}
                    />
                    <SidebarButton
                        label='Stats' baseUrl='/stats' icon={<AreaChart />} active={activeMenu === 'stats'}
                    />
                    <SidebarButton
                        label='Profile' baseUrl='/profile' icon={<UserCog />} active={activeMenu === 'profile'}
                    />
                </div>
            </div>
        </div>
    )
}
