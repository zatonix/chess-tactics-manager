import { CircleOff } from 'lucide-react'
import { Text } from '@/components/ui/text'

interface NoGameFoundProps {
  marginTop?: number
}

export const NoGameFound = ({ marginTop = 0 }: NoGameFoundProps) => {
  const paddingClass = `pt-${marginTop}`
  
  return (
    <div className={`h-full ${paddingClass}`}>
      <div className='flex flex-col justify-center items-center gap-2 h-full'>
      <CircleOff size={25} />
      <Text as='p'>No game found</Text>
      </div>
    </div>
  )
}