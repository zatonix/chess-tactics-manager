import { UserDetails } from '@/app/(general)/UserDetails'
import { checkServerSessionOrRedirect } from '@/lib/authentication'

export default async function DashboardPage() {
  const user = await checkServerSessionOrRedirect()

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
        <UserDetails
          user={user!}
        />
      </div>
    </main>
  )
}
