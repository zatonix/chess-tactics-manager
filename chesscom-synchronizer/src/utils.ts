import { GameStatus } from "@prisma/client";
import { Chess } from "chess.js";

export const extractHeaderFromPgn = (pgn: string, headerName: string) => {
  const regex = new RegExp(`\\[${headerName} "(.*?)"\\]`);
  const match = pgn.match(regex);
  return match ? match[1] : null;
}

export const formatEcoUrl = (ecoUrl: string) => {
  const opening = ecoUrl.replace('https://www.chess.com/openings/', '')
  return opening.replace(/-/g, ' ')
}

export const removeHeaders = (pgn: string): string => {
  const cleanedPgn = pgn.replace(/\[.*?\]\n?/g, '')
  return cleanedPgn.trim()
}

export const removeComments = (pgn: string): string => {
  const cleanedPgn = pgn.replace(/\{.*?\}/g, '')
  return cleanedPgn.trim()
}

export const getClocksFromPgn = (pgn: string) => {
  const chess = new Chess()
  chess.loadPgn(pgn)
  const clockComments = chess.getComments()
  const clocks = clockComments.map((comment) => {
    const regex = /\[%clk (\d+:\d+:\d+(\.\d+)?)\]/
    const match = comment.comment.match(regex)
    if (match === null) {
      console.log(`Invalid clock format: ${comment.comment}`)
      return NaN
    }
    const totalSeconds = match[1].split(':').reduce((acc, time, index) => {
      const multiplier = [3600, 60, 1][index]
      return acc + (parseInt(time) * multiplier)
    }, 0)
    return totalSeconds
  })
  return clocks
}

export const getMovesFromPgn = (pgn: string) => {
  const chess = new Chess()
  chess.loadPgn(pgn)
  return chess.history().join(' ')
}

export const transcodeResultStatus = (result: string): GameStatus => {
  const mappingStatus: { [key: string]: GameStatus } = {
    checkmated: 'mate',
    resigned: 'resign',
    timevsinsufficient: 'outoftime',
    abandoned: 'resign',
    repetition: 'draw',
    agreed: 'draw',
    insufficient: 'draw',
  }
  return mappingStatus[result] ?? result as GameStatus
}