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
    <html lang="en">
      <body className="font-sans min-h-screen bg-background antialiased" suppressHydrationWarning={true}>
          {children}
      </body>
    </html>
  )
}
