from enum import Enum

from pydantic import BaseModel

class TacticType(str, Enum):
    FORK = 'fork'
    STALEMATE = 'stalemate'
    CHECKMATE = 'checkmate'

class BlunderContext(BaseModel):
    white_player: str
    black_player: str
    is_white: bool
    game_id: str
    fen_before_blunder: str
    wrong_move: str
class MissedTactic(BaseModel):
    type: TacticType
    fen: str
    variant: list[str]
    move_number: int
    context: BlunderContext
class MissedFork(MissedTactic):
    type: TacticType = TacticType.FORK
    attacker: str
    attacked: list[str]
class Fork(BaseModel):
    attacker: str
    attacked: list[str]
