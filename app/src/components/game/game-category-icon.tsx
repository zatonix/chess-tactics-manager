import { GameCategory } from '@prisma/client'
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import {
  CalendarClock,
  RabbitIcon,
  TrainFront,
  TurtleIcon,
  Zap
} from 'lucide-react'

interface GameCategoryIconProps {
  category: GameCategory
}

export const GameCategoryIcon = ({ category }: GameCategoryIconProps) => {
  const getIcon = () => {
    if (category === 'blitz') {
      return <Zap size={20} />
    }
    if (category === 'rapid') {
      return <RabbitIcon size={20} />
    }
    if (category === 'bullet') {
      return <TrainFront size={20} />
    }
    if (category === 'classical') {
      return <TurtleIcon size={20} />
    }
    if (category === 'daily') {
      return <CalendarClock size={20} />
    }
    return null
  }

  return <Tooltip>
    <TooltipTrigger>
    {getIcon()}
    </TooltipTrigger>
    <TooltipContent className='p-2 text-white bg-black rounded-none'>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </TooltipContent>
    </Tooltip>
}
