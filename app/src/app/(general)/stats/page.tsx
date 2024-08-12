import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { cn } from '@/lib/utils'

export default async function StatsPage() {
    await checkServerSessionOrRedirect()

    return (
        <MotionCard
          className={cn(
            'w-full h-[calc(100vh-2rem)] bg-foreground xl:col-span-12 p-2 text-white rounded-none border-none'
          )}
        >
          <CardHeader>
            <CardTitle className='flex w-full justify-between items-center'>
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </MotionCard>
    )
}
