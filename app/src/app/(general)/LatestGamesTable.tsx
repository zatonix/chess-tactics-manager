'use client'

import { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Game } from '@prisma/client'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useGameStore } from './GameStore'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'

const columnHelper = createColumnHelper<Game>()

const columns = [
  columnHelper.accessor('category', {
    size: 100,
    header: () => <span>Speed</span>,
    cell: (info) => {
      return (
        <div className='flex items-center justify-center'>
          <Image
            src={`/blitz.svg`}
            width={20}
            height={20}
            alt={info.getValue()}
          />
        </div>
      )
    }
  }),
  {
    id: 'players',
    accessor: 'players',
    cell: (props: any) => (
      <div className='flex flex-col gap-2'>
        <div>{props.row.original.whitePlayer} ({props.row.original.whiteRating})</div>
        <div>{props.row.original.blackPlayer} ({props.row.original.blackRating})</div>
      </div>
    ),
    size: 100,
    header: () => <span>Players</span>
  },
  {
    id: 'result',
    accesor: 'result',
    size: 100,
    header: () => 'Result',
    cell: (props: any) => (
      <div className='flex flex-col gap-2'>
        <div>{props.row.original.winner === 'white' ? '1' : '0'}</div>
        <div>{props.row.original.winner === 'black' ? '1' : '0'}</div>
      </div>
    )
  },
  columnHelper.accessor('status', {
    size: 100,
    header: () => <span>Tags</span>,
    cell: (info) => {
      return (
        <Badge className='text-white rounded-none bg-white/20'>
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
  games: Game[]
}

export const LatestGamesTable = ({ games }: LatestGamesTableProps) => {
  const [data] = useState(() => [...games])
  const selected = useGameStore((state) => state.game)
  const setSelected = useGameStore((state) => state.setGame)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (games.length === 0) {
    return (
      <div className='flex items-center justify-center w-full h-72'>
        <span>No game found yet</span>
      </div>
    )
  }

  return (
    <div className='w-full p-0 overflow-scroll h-72'>
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
