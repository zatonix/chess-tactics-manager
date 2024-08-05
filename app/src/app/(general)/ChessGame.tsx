'use client'

import { Chessboard } from 'react-chessboard'
import Image from 'next/image'
import { useGameStore } from './GameStore'
import { Chess } from 'chess.js'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { MotionCard } from '@/components/ui/motion-card'
import { chunk, isNil } from 'lodash'
import { Text } from '@/components/ui/text'
import { BookOpenText, StepBack, StepForward } from 'lucide-react'

export const ChessGame = () => {
  const moveRefs = useRef<HTMLElement[]>([])
  const game = useGameStore((state) => state.game)
  const [moveIndex, setMoveIndex] = useState(0)
  const [currentGame, setCurrentGame] = useState(new Chess())

  const scrollToMove = (index: number) => {
    moveRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const goToMove = (index: number) => {
    if (isNil(game)) {
      return
    }
    const gameCopy = new Chess()
    for (const move of game.pgn.split(' ').slice(0, index)) {
      gameCopy.move(move)
    }
    setCurrentGame(gameCopy)
    setMoveIndex(index)
    scrollToMove(Math.floor(index / 2))
  }

  const nextMove = () => {
    goToMove(moveIndex + 1)
  }

  const previousMove = () => {
    goToMove(moveIndex - 1)
  }

  useEffect(() => {
    setCurrentGame(new Chess())
    setMoveIndex(0)
    scrollToMove(0)
  }, [game])

  if (isNil(game)) {
    return null
  }
  
  return (
    <MotionCard
      className={cn(
        'col-span-12 h-96 bg-black',
        'border-primary border-l-4 border-r-0 border-t-0 border-b-0 text-white rounded-none'
      )}
    >
      <div className='flex size-full overflow-x-scroll p-4 px-8'>
        <div className='flex size-full items-center xl:w-2/3'>
          <div className=''>
            <Chessboard
              id='BasicBoard'
              boardWidth={350}
              position={currentGame.fen()}
              customDarkSquareStyle={{ backgroundColor: '#283762' }}
              customLightSquareStyle={{ backgroundColor: '#BAC3E4' }}
            />
          </div>
          <div className='flex size-full min-w-64 flex-col items-start justify-start gap-2 p-2 pt-4'>
            <div className='flex w-full justify-around'>
              <Image src='/blitz.svg' width={20} height={20} alt='White' />
              <div>
                {new Date(game.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div className='grid w-full justify-center'>
              <div className='flex gap-8'>
                <span className='w-32'>{game.whitePlayer}</span>
                <span className='w-16'>{game.whiteRating}</span>
              </div>
              <div className='flex gap-8'>
                <span className='w-32'>{game.blackPlayer}</span>
                <span className='w-16'>{game.blackRating}</span>
              </div>
            </div>
            <div className='max-h-52 w-full overflow-y-scroll'>
              <table className='m-auto w-2/3'>
                <thead className='bg-foreground text-center'>
                  <i className='flex items-center justify-around text-sm'>
                    {game.opening} <BookOpenText size={14} />
                  </i>
                </thead>
                {chunk(game.pgn.split(' '), 2).map(
                 
                   // @ts-ignore
                   (moves: string[], index: number) => { 
                    return (
                      <tr
                        className='flex justify-around text-xs odd:bg-foreground'
                        key={`move-${index}`}
                        // @ts-ignore
                        ref={(el: HTMLTableRowElement | null) =>
                          (moveRefs.current[index] = el!)
                        }
                      >
                        <td className='w-14'>{index + 1}.</td>
                        <td
                          onClick={() => goToMove(index * 2 + 1)}
                          className={cn('w-14 cursor-pointer', {
                            'font-bold text-active':
                              Math.floor((moveIndex - 1) / 2) === index &&
                              moveIndex % 2 === 1
                          })}
                        >
                          {moves[0]}
                        </td>
                        <td
                          onClick={() => goToMove(index * 2 + 2)}
                          className={cn('w-14 cursor-pointer', {
                            'font-bold text-active':
                              Math.floor((moveIndex - 1) / 2) === index &&
                              moveIndex % 2 === 0
                          })}
                        >
                          {moves[1]}
                        </td>
                      </tr>
                    )
                  }
                )}
              </table>
            </div>
            <div className='mt-4 flex w-full justify-around'>
              <Button onClick={previousMove} disabled={moveIndex <= 0}>
                <StepBack />
              </Button>
              <Button
                onClick={nextMove}
                disabled={moveIndex >= game.pgn.split(' ').length}
              >
                <StepForward />
              </Button>
            </div>
          </div>
        </div>
        <div className='hidden h-full w-1/3 items-center justify-center bg-foreground xl:flex'>
          <Text as='h4'>No analysis yet</Text>
        </div>
      </div>
    </MotionCard>
  )
}
