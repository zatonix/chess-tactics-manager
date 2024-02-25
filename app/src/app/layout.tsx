import './globals.css'
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, AreaChart, UserCog } from 'lucide-react'

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
      <body
        className={cn("font-sans min-h-screen bg-background antialiased")}>
        <div className="w-full h-screen flex bg-background text-white">
          <div className="flex flex-col min-w-24 w-24 justify-between items-center bg-foreground shadow-lg">
            <Image src="/logo.png" width="310" height="310" alt="logo" className="w-16 m-4" />
            <div className="flex flex-col items-center justify-around gap-12">
              <Button variant="link" className="w-16" size="lg">
                <div className="flex flex-col justify-center items-center">
                  <LayoutDashboard />                Dashboard
                </div>
              </Button>
              <Button variant="link" className="w-16" size="lg">
                <div className="flex flex-col justify-center items-center">
                  <AreaChart />                Stats
                </div>
              </Button>
              <Button variant="default" className="w-16 text-white bg-active" size="lg">
                <div className="flex flex-col justify-center items-center">
                  <UserCog />
                  Profil
                </div>
              </Button>
            </div>
            <p>
             </p>
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
