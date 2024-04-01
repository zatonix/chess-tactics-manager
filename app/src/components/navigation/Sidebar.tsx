
'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { LayoutDashboard, AreaChart, UserCog } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarButton } from './SidebarButton'

export const Sidebar = () => {
    const pathname = usePathname()

    const activeMenu = useMemo(() => {
        if (pathname?.startsWith('/stats')) {
            return 'stats'
        } else if (pathname?.startsWith('/profil')) {
            return 'profile'
        }
        return 'home'
    }, [pathname])

    return (
        <div className='flex flex-col min-w-20 w-20 justify-between items-center bg-foreground shadow-lg'>
            <Image src='/logo.png' width='310' height='310' alt='logo' className='w-12 m-4' />
            <div className='flex flex-col items-center justify-around gap-12'>
                <SidebarButton
                    label='Home' baseUrl='/' icon={<LayoutDashboard />} active={activeMenu === 'home'}
                />
                <SidebarButton
                    label='Stats' baseUrl='/stats' icon={<AreaChart />} active={activeMenu === 'stats'}
                />
                <SidebarButton
                    label='Profile' baseUrl='/profile' icon={<UserCog />} active={activeMenu === 'profile'}
                />
            </div>
            <p></p>
        </div>
    )
}
