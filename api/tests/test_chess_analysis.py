import pytest

from services.chess_analysis import load_from_pgn, get_board_after_moves, check_fork_in_variant, check_checkmate_in_variant
from services.chess_analysis.types import BlunderContext

from .const import SIMPLE_PGN, FORK_PGN, CHECKMATE_PGN

class TestAnalysis:

    def test_load_game_from_pgn(self):
        assert load_from_pgn(SIMPLE_PGN) is not None


    def test_find_fork_in_right_variant(self):
        game = load_from_pgn(FORK_PGN)

        assert game is not None

        board = get_board_after_moves(game, ['e4', 'e5', 'Nc3', 'Nc6', 'Nd5', 'Qh4'])

        context = BlunderContext(
            white_player='white',
            black_player='black',
            fen_before_blunder=board.fen(),
            is_white=True,
            wrong_move='Qh7',
            game_id='game_id'
        )

        missed_fork = check_fork_in_variant(board, str('Nxc7+ Kd8 Nxa8 Qxe4+ Ne2').split(), context)

        assert missed_fork is not None
        assert missed_fork.type == 'fork'
        assert missed_fork.fen == 'r1b1kbnr/ppNp1ppp/2n5/4p3/4P2q/8/PPPP1PPP/R1BQKBNR b KQkq - 0 4'
        assert missed_fork.context.fen_before_blunder == 'r1b1kbnr/pppp1ppp/2n5/3Np3/4P2q/8/PPPP1PPP/R1BQKBNR w KQkq - 4 4'
        assert missed_fork.variant == ['Nxc7+', 'Kd8', 'Nxa8', 'Qxe4+', 'Ne2']
        assert missed_fork.context.white_player == 'white'
        assert missed_fork.context.black_player == 'black'
        assert missed_fork.context.game_id == 'game_id'
        assert missed_fork.move_number == 1

    def test_find_checkmate_in_right_variant(self):
        game = load_from_pgn(CHECKMATE_PGN)

        assert game is not None

        board = get_board_after_moves(game, ['e4', 'e5', 'Bc4', 'd6', 'Qf3', 'b6'])

        context = BlunderContext(
            white_player='white',
            black_player='black',
            fen_before_blunder=board.fen(),
            game_id='game_id',
            is_white=True,
            wrong_move='b7'
        )

        missed_checkmate = check_checkmate_in_variant(board, str('Qxf7#').split(), context)

        assert missed_checkmate is not None
        assert missed_checkmate.type == 'checkmate'
        assert missed_checkmate.fen == 'rnbqkbnr/p1p2Qpp/1p1p4/4p3/2B1P3/8/PPPP1PPP/R3K2R b KQkq - 0 4'
        assert missed_checkmate.context.fen_before_blunder == 'rnbqkbnr/p1p2ppp/1p1p4/4p3/2B1P3/5Q2/PPPP1PPP/R3K2R w KQkq - 0 4'
        assert missed_checkmate.variant == ['Qxf7#']
        assert missed_checkmate.context.white_player == 'white'
        assert missed_checkmate.context.black_player == 'black'
        assert missed_checkmate.context.game_id == 'game_id'
        assert missed_checkmate.move_number == 1
