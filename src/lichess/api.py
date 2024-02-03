'''
This module contains the functions to interact with the Lichess API
'''
import ndjson
import requests

def get_lichess_games(username: str, max_games: int = 100, analysed: bool = False) -> dict:
    '''
    Get the games of a user from Lichess

    Args:
        username (str): The username

    Returns:
        dict: The games of the user
    '''
    headers = {
        'Accept': 'application/x-ndjson'
    }

    params = {
        'rated': True,
        'opening': True,
        'accuracy': True,
        'pgnInJson': True,
        'max': max_games,
        'analysed': analysed
    }

    response = requests.get(f'https://lichess.org/api/games/user/{username}', headers=headers, params=params, timeout=60)
    return ndjson.loads(response.content)


def get_lichess_game_details(game_id: str) -> dict:
    '''
    Get the details of a game from Lichess

    Args:
        game_id (str): The game ID

    Returns:
        dict: The details of the game
    '''
    headers = {
        'Accept': 'application/json'
    }

    response = requests.get(f'https://lichess.org/game/export/{game_id}', headers=headers, timeout=60)

    return response.json()
