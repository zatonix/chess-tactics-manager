import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '@/pages/api/auth/[...nextauth]'
import { User } from '@/components/auth/User'

export default async function Home() {
  const session = await getServerSession(nextAuthConfig)
  if (!session) {
    return redirect('/signin')
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <User session={session} />
      </div>
    </main>
  )
}
