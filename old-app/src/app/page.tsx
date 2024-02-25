"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChessVariant } from "@/components/chess/chess_variant";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator"
import { useMemo, useState } from "react";
import { Arrow } from "react-chessboard/dist/chessboard/types";


interface BlunderContext {
  white_player: string
  black_player: string
  fen_before_blunder: string
  game_id: string
  wrong_move: string
}

interface MissedTactic {
  type: 'fork' | 'checkmate' | 'stalemate'
  context: BlunderContext
  fen: string
  move_number: number
  variant: string[]
  attacked: string[]
  attacker: string
}

export default function Home() {

  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [missedTactics, setMissedTactics] = useState<MissedTactic[]>([])
  const [filter, setFilter] = useState("all")

  const fetchMissedTactics = async (name: string) => {
    setIsLoading(true)
    setMissedTactics([])
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHESS_ANALYSIS_URL}/missed_tactics/${name}`)
    const data = await response.json() as MissedTactic[]
    console.log(data)
    setMissedTactics(data)
    setIsLoading(false)
  }

  const filterTactics = useMemo(() => {
    return missedTactics.filter((tactic) => tactic.type === filter || filter === 'all')
  }, [missedTactics, filter])

  return (
    <main className="flex min-h-screen flex-col items-center space-y-5 p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <Input className="w-240" placeholder="Lichess username" value={username} onChange={(value) => setUsername(value.currentTarget.value)}/>
          <Button className="ml-4" onClick={() => { fetchMissedTactics(username) }}>Start analysis</Button>
        </p>
      </div>
      {isLoading && <div>
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>}
        {missedTactics.length > 0 && <div className="mt-8">
           <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Found {filterTactics.length} missed tactics
          </h2>

          <RadioGroup value={filter} className="grid-flow-col mt-4 mb-8" orientation="horizontal" onValueChange={(value) => setFilter(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fork" id="fork" />
              <Label htmlFor="fork">Fork</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="checkmate" id="checkmate" />
              <Label htmlFor="checkmate">Checkmate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stalemate" id="stalemate" />
              <Label htmlFor="stalemate">Stalemate</Label>
            </div>
          </RadioGroup>

          <ul>
            {filterTactics.map((tactic) => {
            const moveCount = Math.ceil(tactic.variant.length / 2)
            const customArrows = tactic.attacked?.map((attacked) => [tactic.attacker, attacked, 'orange']) as (Arrow[] | undefined)
            return (<li key={tactic.fen} className='mb-5'>
              <a href={`https://lichess.org/${tactic.context.game_id}`} target="_blank" rel="noreferrer noopener" className="text-blue-600 underline">
                {tactic.context.white_player} vs {tactic.context.black_player}
               </a>
               {` -> ${tactic.type}`}
               {tactic.type === 'checkmate' && ` in ${moveCount} move${moveCount > 1 ? 's' : ''}`}
               <ChessVariant initialPosition={tactic.context.fen_before_blunder} variant={tactic.variant} wrongMove={tactic.context.wrong_move} tacticIndex={tactic.move_number} customArrows={customArrows}/>
                <Separator orientation="horizontal" className="mb-4 mt-4"/>
            </li>)
          })}
          </ul>
        </div>}

    </main>
  );
}
