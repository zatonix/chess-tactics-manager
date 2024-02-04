'''
This module contains the functions to interact with the Lichess API
'''
import requests

from typing import Union

LICHESS_API_URL = 'https://lichess.org'

class Client:

    def __init__(self, token: Union[str, None] = None):
        self.token = token

    def request(self, method, uri, headers = None, params = None, timeout = 60) -> requests.Response:
        response = requests.request(method, f'{LICHESS_API_URL}/{uri}', headers=headers, params=params, timeout=timeout)
        return response
