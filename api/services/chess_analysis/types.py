from enum import Enum

from pydantic import BaseModel

class TacticType(str, Enum):
    fork = 'fork'
    stalemate = 'stalemate'
    checkmate = 'checkmate'

class MissedTactic(BaseModel):
    type: TacticType
    fen: str
    fen_before_blunder: str
    variant: list[str]
    white_player: str
    black_player: str
    game_id: str
    move_number: int

class BlunderContext(BaseModel):
    move_number: int
    white_player: str
    black_player: str
    game_id: str
    fen_before_blunder: str
