import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Chess } from 'chess.js'
import { useMemo, useState } from 'react'

import { Chessboard } from "react-chessboard"
import { Arrow } from 'react-chessboard/dist/chessboard/types'
import { Button } from '../ui/button'

interface ChessVariantProps {
    initialPosition: string
    tacticIndex: number
    variant: string[]
    wrongMove?: string
    customArrows?: Arrow[]
}

export const ChessVariant = ({
    initialPosition,
    tacticIndex,
    variant,
    wrongMove,
    customArrows
}: ChessVariantProps) => {

  const [currentMoves, setCurrentMoves] = useState<string[]>([])

  const game = useMemo(() => {
    const gameCopy = new Chess(initialPosition)
    currentMoves.forEach((move) => {
        gameCopy.move(move)
    })

    return gameCopy
  }, [initialPosition, currentMoves])

  const nextMove = () => {
    setCurrentMoves([...currentMoves, variant[currentMoves.length]])
  }

  const previousMove = () => {
    const movesCopy = [...currentMoves]
    movesCopy.pop()
    setCurrentMoves(movesCopy)
  }

  const goToTacticMove = () => {
    const movesCopy = variant.slice(0, tacticIndex)
    setCurrentMoves(movesCopy)
  }

  const arrows = useMemo(() => {
     if (currentMoves.length === tacticIndex) {
        return customArrows
    }

    if (wrongMove === undefined) {
        return undefined
    }

    if (currentMoves.length === 0 ) {
        const wrongMoveBoard = new Chess(initialPosition).move(wrongMove)
        const rightMoveBoard = new Chess(initialPosition).move(variant[0])
        return [
            [rightMoveBoard.from, rightMoveBoard.to, 'green'],
            [wrongMoveBoard.from, wrongMoveBoard.to, 'red']
        ]
    }

    return undefined
  }, [currentMoves.length, tacticIndex, wrongMove, customArrows, initialPosition, variant]) as Arrow[] | undefined

  return (
    <div>
        <div className='flex justify-center'>
            <div>
                <Chessboard
                    boardWidth={400}
                    areArrowsAllowed={false}
                    arePiecesDraggable={false}
                    arePremovesAllowed={false}
                    position={game.fen()}
                    customArrows={arrows ?? []}
                />
            </div>
        </div>
        <div className='flex justify-center space-x-5 w-400 mt-4'>
            <Button disabled={currentMoves.length < 1} onClick={() => setCurrentMoves([])}>
                <DoubleArrowLeftIcon />
            </Button>
            <Button disabled={currentMoves.length < 1} onClick={previousMove}>
                <ChevronLeftIcon />
            </Button>
            {customArrows && <Button disabled={currentMoves.length === tacticIndex} onClick={goToTacticMove}>
                <EyeOpenIcon />
            </Button>}
            <Button disabled={currentMoves.length >= variant.length} onClick={nextMove}>
                <ChevronRightIcon />
            </Button>
            <Button disabled={currentMoves.length >= variant.length} onClick={() => setCurrentMoves(variant)}>
                <DoubleArrowRightIcon />
            </Button>
        </div>
    </div>
  )
}
