'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip } from '@/components/ui/tooltip'
import { getFilteredGames } from '@/lib/stats/insights-data'
import { cn } from '@/lib/utils'
import { ChessAccount, Game } from '@prisma/client'
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Crown,
  Minus,
  Skull
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { GameCategoryIcon } from './game-category-icon'
import { useGameStore } from './game.store'
import { NoGameFound } from './no-game-found'

const columnHelper = createColumnHelper<Game>()

const columns = [
  columnHelper.accessor('category', {
    size: 100,
    header: () => <span>Speed</span>,
    cell: (info) => {
      return (
        <div className='flex items-center justify-center'>
          <GameCategoryIcon category={info.getValue()} />
        </div>
      )
    }
  }),
  {
    id: 'players',
    accessor: 'players',
    cell: (props: any) => (
      <div className='flex flex-col gap-1'>
        <div>{props.row.original.whitePlayer}</div>
        <div>{props.row.original.blackPlayer}</div>
      </div>
    ),
    size: 100,
    header: () => <span>Players</span>
  },
  {
    id: 'result',
    accesor: 'result',
    size: 100,
    header: () => <span>Result</span>,
    cell: (props: any) => (
      <div className='flex flex-col gap-1'>
        <div className='flex justify-center align-baseline gap-1'>
          <div className='h-full m-auto mx-1' >
            {props.row.original.winner === 'white' ? (
              <Crown size={15} />
            ) : props.row.original.winner === 'black' ? (
              <Skull size={15} />
            ) : (
              <Minus size={15}/>
            )}
          </div>
          <div className='h-full' >{props.row.original.whiteRating}</div>
        </div>
        <div className='flex justify-center align-baseline gap-1'>
          
          <div className='h-full m-auto mx-1'>
            {props.row.original.winner === 'black' ? (
              <Crown size={15} />
            ) : props.row.original.winner === 'white' ? (
              <Skull size={15} /> 
            ) : (
              <Minus size={15}/>
            )}
          </div>
          <div className='h-full'>{props.row.original.blackRating}</div>
        </div>
      </div>
    )
  },
  columnHelper.accessor('status', {
    size: 100,
    header: () => <span>Status</span>,
    cell: (info) => {
      return (
        <Badge className='text-white rounded-none bg-white/20 hover:bg-white/20'>
          {info.getValue()}
        </Badge>
      )
    }
  }),
  columnHelper.accessor('status', {
    size: 100,
    header: 'Analysis',
    cell: () => {
      return (
        <div className='flex items-center justify-center'>
          <Image
            src={`/notAnalysed.svg`}
            width={20}
            height={20}
            alt='analysis'
          />
        </div>
      )
    }
  }),
  columnHelper.accessor('date', {
    size: 150,
    header: 'Date',
    cell: (info) => (
      <Tooltip>
        <TooltipTrigger>
          {info.getValue().toLocaleDateString('en-EN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </TooltipTrigger>
        <TooltipContent className='p-2 text-white bg-black border-l-4 rounded-none shadow-xl border-primary'>
          {info.getValue().toLocaleString('en-EN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          })}
        </TooltipContent>
      </Tooltip>
    )
  })
]

interface LatestGamesTableProps {
  chessAccounts: ChessAccount[]
  initialGames: Game[]
}

export const LatestGamesTable = ({ chessAccounts, initialGames }: LatestGamesTableProps) => {
  const [data, setData] = useState(() => [...initialGames])
  const [selected, setSelected] = useGameStore((state) => [state.game, state.setGame])
  const selectedFilters = useGameStore((state) => state.filters)

  useEffect(() => {
    const fetchFilteredGames = async () => {
      const games = await getFilteredGames(
        chessAccounts,
        selectedFilters,
        10,
        0
      )
      setData(games)
    }
    fetchFilteredGames()
  }, [selectedFilters, chessAccounts])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (data.length === 0) {
    return <NoGameFound marginTop={24} />
  }

  return (
    <div className='w-full p-0 overflow-y-scroll h-72'>
      <table className='w-full'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='text-center'>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'h-16 text-center odd:bg-background cursor-pointer',
                'border-primary hover:bg-black/90',
                {
                  'bg-black border-l-4': selected === row.original,
                  'odd:bg-black border-l-4': selected === row.original
                }
              )}
              onClick={() => {
                selected === row.original
                  ? setSelected(null)
                  : setSelected(row.original)
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
