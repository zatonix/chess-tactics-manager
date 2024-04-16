import React from 'react'
import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Chess Tactics Manager',
  description: 'A great analysis application of chess tactics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background font-sans antialiased' suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
