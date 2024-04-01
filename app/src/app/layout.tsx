import React from 'react'
import { Toaster } from 'react-hot-toast'
import './globals.css'

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
      <body className='font-sans min-h-screen bg-background antialiased' suppressHydrationWarning={true}>
       {children}
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
            style: {
              borderRadius: '10px',
              background: '#121212',
              color: '#fff',
              maxWidth: '500px',
            },
          }}
        />
      </body>
    </html>
  )
}
