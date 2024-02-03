'''
This module contains the functions to load a game from a PGN string, get the board after a list of moves,
check if there is a fork in a position, check if there is a fork in a variant, check if there is a stalemate in a variant
'''
import io
from typing import Tuple, Union
import chess
import chess.pgn


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
            print(f"Move {move} is not legal in the current position")
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
                print(f"Fork found at {chess.SQUARE_NAMES[piece]}")

                return True

    return False

def check_fork_in_variant(board: chess.Board, variant: list[str]) -> Tuple[bool, Union[chess.Board, None]]:
    '''
    Check if there is a fork in a variant

    Args:
        board (chess.Board): The board in the initial position
        variant (list[str]): The list of moves

    Returns:
        Tuple[bool, Union[chess.Board, None]]: A tuple with a boolean indicating if a fork is found and the board position
    '''
    if check_fork_in_position(board):
        return True, board

    for move in variant:
        move = board.parse_san(move)
        if move in board.legal_moves:
            board.push(move)
            if check_fork_in_position(board):
                return True, board
        else:
            print(f"Move {move} is not legal in the current position")
            break

    return False, None

def check_stalemate_in_variant(board: chess.Board, variant: list[str]) -> Tuple[bool, Union[chess.Board, None]]:
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
            print(f"Move {move} is not legal in the current position")
            break

    if board.is_stalemate():
        return True, board

    return False, None
