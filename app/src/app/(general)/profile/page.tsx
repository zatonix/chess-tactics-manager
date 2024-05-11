import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { UserDetails } from './UserDetails'

export default async function ProfilePage() {
  const user = await checkServerSessionOrRedirect()

  return (
    <>
      <UserDetails user={user!} />
    </>
  )
}
