'''
This module contains the functions to interact with the Lichess API
'''
from typing import Union

import requests

LICHESS_API_URL = 'https://lichess.org'

class Client:

    def __init__(self, token: Union[str, None] = None):
        self.token = token

    def request(self, method, uri, headers = None, params = None, timeout = 60) -> requests.Response:
        '''
        Make a request to the Lichess API

        Args:
            method (str): The HTTP method
            uri (str): The URI
            headers (dict): The headers
            params (dict): The parameters
            timeout (int): The timeout

        Returns:
            requests.Response: The response
        '''
        response = requests.request(method, f'{LICHESS_API_URL}/{uri}', headers=headers, params=params, timeout=timeout)
        return response
