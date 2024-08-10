import { Game } from '@prisma/client'
import { create } from 'zustand'

export type GameFilters = {
  providers: string[]
  tags: string[]
  categories: string[]
  winner: string[]
  analysed: string[]
  adversary: string[]
}

type GameStore = {
    game: Game | null
    // eslint-disable-next-line no-unused-vars
    setGame: (_: Game | null) => void
    filters: GameFilters
    // eslint-disable-next-line no-unused-vars
    setFilters: (_: GameFilters) => void
  }

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  setGame: (game: Game | null) => set({ game }),
  filters: {
    providers: [],
    tags: [],
    winner: [],
    categories: [],
    analysed: [],
    adversary: []
  },
  setFilters: (filters: GameFilters) => set({ filters })
}))