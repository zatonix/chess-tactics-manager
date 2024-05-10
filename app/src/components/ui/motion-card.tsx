'use client'

import { motion } from 'framer-motion'
import { Card } from './card'
import { PropsWithChildren } from 'react'

interface MotionCardProps {
  className: string
}

const MotionCardComponent = motion(Card)

export const MotionCard = ({
  children,
  className
}: PropsWithChildren<MotionCardProps>) => {
  return (
    <MotionCardComponent
      className={className}
      animate={{ x: 0, opacity: 1 }}
      initial={{ x: -50, opacity: 0 }}
    >
      {children}
    </MotionCardComponent>
  )
}
