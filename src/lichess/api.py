import json
import ndjson
import requests

def get_lichess_games(username: str) -> dict:
    headers = {
        'Accept': 'application/x-ndjson'
    }

    params = {
        'rated': True,
        'opening': True,
        'accuracy': True,
        'pgnInJson': True,
    }

    response = requests.get(f'https://lichess.org/api/games/user/{username}', headers=headers, params=params)
    return ndjson.loads(response.content)


def get_lichess_game_details(game_id: str) -> dict:
    headers = {
        'Accept': 'application/json'
    }

    response = requests.get(f'https://lichess.org/game/export/{game_id}', headers=headers)

    return response.json()
