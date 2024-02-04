'''
This module contains the functions to interact with the Lichess API
'''
from typing import Union

from lichess.client import Client
from lichess.endpoints.games import GamesEndpoint

class LichessClient:

    def __init__(self, token: Union[str, None] = None):
        self.token = token
        self._client = Client(token)
        self.games = GamesEndpoint(self._client)
