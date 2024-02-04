import pytest
from services.chess_analysis import load_from_pgn, get_board_after_moves, check_fork_in_variant, check_checkmate_in_variant
from .const import SIMPLE_PGN, FORK_PGN, CHECKMATE_PGN

class TestAnalysis:

    def test_load_game_from_pgn(self):
        assert load_from_pgn(SIMPLE_PGN) is not None


    def test_find_fork_in_right_variant(self):
        game = load_from_pgn(FORK_PGN)

        assert game is not None

        board = get_board_after_moves(game, ['e4', 'e5', 'Nc3', 'Nc6', 'Nd5', 'Qh4'])

        has_fork, _ = check_fork_in_variant(board, 'Nxc7+ Kd8 Nxa8 Qxe4+ Ne2'.split()) # type: ignore

        assert has_fork

    def test_find_checkmate_in_right_variant(self):
        game = load_from_pgn(CHECKMATE_PGN)

        assert game is not None

        board = get_board_after_moves(game, ['e4', 'e5', 'Bc4', 'd6', 'Qf3', 'b6'])

        has_checkmate, _ = check_checkmate_in_variant(board, 'Qxf7#'.split()) # type: ignore

        assert has_checkmate
