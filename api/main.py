from fastapi import FastAPI

from services.chess_analysis import (check_checkmate_in_variant, check_fork_in_variant,
                            check_stalemate_in_variant, get_board_after_moves,
                            load_from_pgn)
from services.lichess import LichessClient


app = FastAPI()


lichess_client = LichessClient()

@app.get("/{username}")
def get_analysis(username: str) -> None:
    '''
    Get analysis for a user's games

    Args:
        username (str): The username to get the games from
    '''
    print('Loading games from lichess...')
    games = lichess_client.games.get_from_username(username=username, limit=100, analysed=True)

    print(f'Loaded {len(games)} games')

    for game_index, game in enumerate(games, 1):
        print(f'Game n°{game_index}')

        game_details = lichess_client.games.get_from_id(game.gid)

        if game_details.analysis is None:
            print(f"No analysis for game {game.gid}")
            continue

        if game.pgn is None:
            print(f"No pgn for game {game.gid}")
            continue

        board = load_from_pgn(game.pgn)
        if board is None:
            print(f"Error loading board from pgn: {game.pgn}")
            continue

        for index, move in enumerate(game_details.analysis):
            if move.judgment is not None and move.variation is not None:
                variant_moves = move.variation.split()

                moves_before_blunder = game.moves.split()[:index]
                game_before_blunder = get_board_after_moves(board, moves_before_blunder)

                has_fork, fork_position = check_fork_in_variant(game_before_blunder.copy(), variant_moves)
                if has_fork and fork_position is not None:
                    print(f"Fork found in position: \n{fork_position}")
                    print(fork_position.fen())

                has_stalemate, stalemate_position = check_stalemate_in_variant(game_before_blunder.copy(), variant_moves)
                if has_stalemate and stalemate_position is not None:
                    print(f"Stalemate found in position: \n{stalemate_position}")
                    print(stalemate_position.fen())

                has_checkmate, checkmate_position = check_checkmate_in_variant(game_before_blunder.copy(), variant_moves)
                if has_checkmate and checkmate_position is not None:
                    print(f"Checkmate found in position: \n{checkmate_position}")
                    print(checkmate_position.fen())
