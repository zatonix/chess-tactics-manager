import logging
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.chess_analysis.types import BlunderContext, MissedFork, MissedTactic
from services.chess_analysis import (check_checkmate_in_variant,
                                     check_fork_in_variant,
                                     check_stalemate_in_variant,
                                     get_board_after_moves, load_from_pgn)

from api_client_initializer import lichess_client

logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/missed_tactics/{username}")
def get_analysis(username: str) -> list[Union[MissedTactic, MissedFork]]:
    '''
    Get analysis for a user's games

    Args:
        username (str): The Lichess username
    '''
    logger.info('Loading games from lichess...')
    games = lichess_client.games.get_from_username(username=username, limit=100, analysed=True)

    logger.info(f'Loaded {len(games)} games')

    response: list[Union[MissedTactic, MissedFork]] = []
    for game_index, game in enumerate(games, 1):
        logger.debug(f'Game n°{game_index}')

        game_details = lichess_client.games.get_from_id(game.gid)

        if game.pgn is None or game_details.analysis is None:
            logger.error(f"Game {game.gid} has no pgn or analysis")
            continue

        board = load_from_pgn(game.pgn)
        if board is None:
            logger.error(f"Error loading board from pgn: {game.pgn}")
            continue

        for index, move in enumerate(game_details.analysis):
            if (index % 2 == 0) and game.white_player.name != username or \
               (index % 2 == 1) and game.black_player.name != username:
                continue

            if move.judgment is not None and move.variation is not None:
                variant_moves = move.variation.split()

                moves_before_blunder = game.moves.split()[:index]
                game_before_blunder = get_board_after_moves(board, moves_before_blunder)

                context = BlunderContext(
                    white_player=game.white_player.name,
                    black_player=game.black_player.name,
                    fen_before_blunder=game_before_blunder.fen(),
                    wrong_move=game.moves.split()[index],
                    is_white=(game.white_player.name == username),
                    game_id=game.gid
                )

                missed_fork = check_fork_in_variant(game_before_blunder.copy(), variant_moves, context)
                if missed_fork is not None:
                    logger.info(missed_fork.fen)
                    response.append(missed_fork)

                missed_checkmate = check_checkmate_in_variant(game_before_blunder.copy(), variant_moves, context)
                if missed_checkmate is not None:
                    logger.info(missed_checkmate.fen)
                    response.append(missed_checkmate)

                missed_stalemate = check_stalemate_in_variant(game_before_blunder.copy(), variant_moves, context)
                if missed_stalemate is not None:
                    logger.info(missed_stalemate.fen)
                    response.append(missed_stalemate)

    return response
