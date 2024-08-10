import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { UserDetails } from './user-details'

export default async function ProfilePage() {
  const user = await checkServerSessionOrRedirect()

  return (
    <>
      <UserDetails user={user!} />
    </>
  )
}
