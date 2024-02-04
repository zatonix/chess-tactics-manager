'''
This module contains the functions to load a game from a PGN string, get the board after a list of moves,
check if there is a fork in a position, check if there is a fork in a variant, check if there is a stalemate in a variant
'''
import io
import logging
from typing import Tuple, Union
import chess
import chess.pgn

from services.chess_analysis.types import TacticType, MissedTactic, BlunderContext

logger = logging.getLogger(__name__)


def load_from_pgn(pgn: str) -> Union[chess.pgn.Game, None]:
    '''
    Load a game from a PGN string

    Args:
        pgn (str): The PGN string

    Returns:
        Union[chess.pgn.Game, None]: The game object if the PGN is valid, None otherwise
    '''
    io_pgn = io.StringIO(pgn)
    return chess.pgn.read_game(io_pgn)

def get_board_after_moves(game: chess.pgn.Game, moves: list[str]) -> chess.Board:
    '''
    Get the board after a list of moves

    Args:
        game (chess.pgn.Game): The game object
        moves (list[str]): The list of moves

    Returns:
        chess.Board: The board after the moves
    '''
    board = game.board()
    for move in moves:
        move = board.parse_san(move)
        if move in board.legal_moves:
            board.push(move)
        else:
            logger.error(f"Move {move} is not legal in the current position")
            break
    return board


def check_fork_in_position(board: chess.Board) -> bool:
    '''
    Check if there is a fork in the current position

    Args:
        board (chess.Board): The board object

    Returns:
        bool: True if a fork is found, False otherwise
    '''
    strong_pieces = [chess.ROOK, chess.QUEEN, chess.KING]
    for piece_type in [chess.PAWN, chess.KNIGHT, chess.ROOK, chess.BISHOP, chess.QUEEN]:
        for piece in board.pieces(piece_type, not board.turn):
            attacked_squares = board.attacks(piece)
            attacked_pieces = []
            for square in attacked_squares:
                piece_on_square = board.piece_at(square)
                if piece_on_square is None or piece_on_square.color != board.turn:
                    continue

                if piece_type == chess.PAWN and piece_on_square.piece_type != chess.PAWN:
                    attacked_pieces.append(piece_on_square)
                elif piece_type not in strong_pieces and piece_on_square.piece_type in strong_pieces:
                    attacked_pieces.append(piece_on_square)
                else:
                    defenders = board.attackers(board.turn, square)
                    if len(defenders) == 0:
                        attacked_pieces.append(piece_on_square)

            attackers = board.attackers(board.turn, piece)

            if len(attackers) == 0 and len(attacked_pieces) >= 2:
                logger.info(f"Fork found at {chess.SQUARE_NAMES[piece]}")

                return True

    return False

def check_fork_in_variant(board: chess.Board, variant: list[str], context: BlunderContext) -> Union[MissedTactic, None]:
    '''
    Check if there is a fork in a variant

    Args:
        board (chess.Board): The board in the initial position
        variant (list[str]): The list of moves

    Returns:
        Tuple[bool, Union[chess.Board, None]]: A tuple with a boolean indicating if a fork is found and the board position
    '''
    if check_fork_in_position(board):
        return MissedTactic(
            type=TacticType.FORK,
            fen=board.fen(),
            variant=variant,
            white_player=context.white_player,
            black_player=context.black_player,
            game_id=context.game_id,
            move_number=context.move_number,
            fen_before_blunder=context.fen_before_blunder
        )

    for move in variant:
        move = board.parse_san(move)
        if move in board.legal_moves:
            board.push(move)
            if check_fork_in_position(board):
                return MissedTactic(
                    type=TacticType.FORK,
                    fen=board.fen(),
                    variant=variant,
                    fen_before_blunder=context.fen_before_blunder,
                    white_player=context.white_player,
                    black_player=context.black_player,
                    game_id=context.game_id,
                    move_number=context.move_number
                )
        else:
            logger.error(f"Move {move} is not legal in the current position")
            break

    return None

def check_stalemate_in_variant(board: chess.Board, variant: list[str], context: BlunderContext) -> Union[MissedTactic, None]:
    '''
    Check if there is a stalemate in a variant

    Args:
        board (chess.Board): The board in the initial position
        variant (list[str]): The list of moves

    Returns:
        Tuple[bool, Union[chess.Board, None]]: A tuple with a boolean indicating if a stalemate is found and the board position
    '''
    for move in variant:
        move = board.parse_san(move)
        if move in board.legal_moves:
            board.push(move)
        else:
            logger.error(f"Move {move} is not legal in the current position")
            break

    if board.is_stalemate():
        return MissedTactic(
            type=TacticType.STALEMATE,
            fen=board.fen(),
            variant=variant,
            fen_before_blunder=context.fen_before_blunder,
            white_player=context.white_player,
            black_player=context.black_player,
            game_id=context.game_id,
            move_number=context.move_number
        )

    return None

def check_checkmate_in_variant(board: chess.Board,  variant: list[str], context: BlunderContext) -> Union[MissedTactic, None]:
    '''
    Check if there is a mate in a variant

    Args:
        board (chess.Board): The board in the initial position
        variant (list[str]): The list of moves

    Returns:
        Tuple[bool, Union[chess.Board, None]]: A tuple with a boolean indicating if a mate is found and the board position
    '''
    for move in variant:
        move = board.parse_san(move)
        if move in board.legal_moves:
            board.push(move)
        else:
            logger.error(f"Move {move} is not legal in the current position")
            break
    if board.is_checkmate():
        return MissedTactic(
            type=TacticType.CHECKMATE,
            fen=board.fen(),
            variant=variant,
            fen_before_blunder=context.fen_before_blunder,
            white_player=context.white_player,
            black_player=context.black_player,
            game_id=context.game_id,
            move_number=context.move_number
        )
    return None
