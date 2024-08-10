import { LogoutButton } from '@/components/auth/logout-button'
import { cn } from '@/lib/utils'
import React from 'react'

export default function SetupLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen gap-40 text-white bg-background '>
      <div
        className={cn(
          'w-3/4 md:w-1/2 m-h-1/2 bg-foreground ',
          'border-l-4 border-r-0 border-t-0 border-b-0 border-primary rounded-none p-5'
        )}
      >
        {children}
      </div>
      <LogoutButton />
    </div>
  )
}
