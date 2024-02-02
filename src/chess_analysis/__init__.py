import io
from typing import Tuple, Union
import chess
import chess.pgn

def load_from_pgn(pgn: str) -> Union[chess.pgn.Game, None]:
    io_pgn = io.StringIO(pgn)
    return chess.pgn.read_game(io_pgn)

def get_board_after_moves(game: chess.pgn.Game, moves: list[str]) -> chess.Board:
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


    strong_pieces = [chess.ROOK, chess.QUEEN, chess.KING]
    for piece_type in [chess.PAWN, chess.KNIGHT, chess.ROOK, chess.BISHOP, chess.QUEEN]:
        for piece in board.pieces(piece_type, not board.turn):
            attacked_squares = board.attacks(piece)
            attacked_pieces = []
            for square in attacked_squares:
                piece_on_square = board.piece_at(square)
                if piece_on_square is None:
                    continue

                if piece_on_square.color == board.turn:
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
