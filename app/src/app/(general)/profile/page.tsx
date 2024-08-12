import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { UserDetails } from './user-details'

export default async function ProfilePage() {
  const user = await checkServerSessionOrRedirect()

  return (
    <div className='grid size-full grid-flow-row-dense grid-cols-12 gap-4'>
      <UserDetails user={user!} />
    </div>
  )
}
