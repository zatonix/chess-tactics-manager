import { Game } from '@prisma/client'
import { create } from 'zustand'

type GameStore = {
    game: Game | null
    // eslint-disable-next-line no-unused-vars
    setGame: (_: Game | null) => void
  }

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  setGame: (game: Game | null) => set({ game }),
}))