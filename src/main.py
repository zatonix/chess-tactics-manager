from lichess.api import get_lichess_games, get_lichess_game_details
from chess_analysis import load_from_pgn, get_board_after_moves, check_fork_in_variant, check_stalemate_in_variant


print('Loading games from lichess...')
games = get_lichess_games("drougone", max=100, analysed=True)

print(f'Loaded {len(games)} games')

for game_index, game in enumerate(games, 1):
    print(f'Game n°{game_index}')

    game_details = get_lichess_game_details(game['id'])
    pgn = game['pgn']

    if 'analysis' not in game_details:
        print(f"No analysis for game {game['id']}")
        continue

    board = load_from_pgn(pgn)
    if board is None:
        print(f"Error loading board from pgn: {pgn}")
        continue

    for index, move in enumerate(game_details['analysis']):
        if 'judgment' in move:
            variant_moves = move['variation'].split()

            moves_before_blunder = game['moves'].split()[:index]
            game_before_blunder = get_board_after_moves(board, moves_before_blunder)

            has_fork, fork_position = check_fork_in_variant(game_before_blunder.copy(), variant_moves)
            if has_fork and fork_position is not None:
                print(f"Fork found in position: \n{fork_position}")
                print(fork_position.fen())

            has_stalemate, stalemate_position = check_stalemate_in_variant(game_before_blunder.copy(), variant_moves)
            if has_stalemate and stalemate_position is not None:
                print(f"Stalemate found in position: \n{stalemate_position}")
                print(stalemate_position.fen())
