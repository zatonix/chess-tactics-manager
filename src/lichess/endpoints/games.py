import ndjson

from dataclasses import dataclass
from typing import Optional

from ..client import Client

@dataclass
class Opening:
    eco: str
    name: str
    ply: int

@dataclass
class Clock:
    initial: int
    increment: int
    totalTime: int

@dataclass
class Division:
    middle: Optional[int]
    endgame: Optional[int]

@dataclass
class PlayerAnalysis:
    inaccuracy: int
    mistake: int
    blunder: int
    acpl: int
    accuracy: Optional[int]

@dataclass
class Player:
    color: str
    name: str
    id: str
    rating: int
    ratingDiff: int
    analysis: Optional[PlayerAnalysis]

@dataclass
class Judgment:
    name: str
    comment: str

@dataclass
class MoveAnalysis:
    eval: Optional[int]
    mat: Optional[int]
    best: Optional[str]
    variation: Optional[str]
    judgment: Optional[Judgment]

@dataclass
class Game:
    id: str
    rated: bool
    variant: str
    speed: str
    perf: str
    source: str
    createdAt: int
    lastMoveAt: int
    moves: str
    status: str
    whitePlayer: Player
    blackPlayer: Player
    clock: Clock
    winner: Optional[str]
    clocks: Optional[list[int]]
    division: Optional[Division]
    pgn: Optional[str]
    analysis: Optional[list[MoveAnalysis]]
    opening: Optional[Opening]


class GamesEndpoint:

    def __init__(self, client: Client):
        self._client = client

    def get_from_username(self, username: str, limit: int = 100, analysed: bool = False) -> list[Game]:
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
            'max': limit,
            'analysed': analysed
        }

        response = self._client.request('GET', f'api/games/user/{username}', headers=headers, params=params)
        response_data = ndjson.loads(response.content)

        games = []
        for game in response_data:
            white_player = game['players']['white']
            black_player = game['players']['black']
            opening = game.get('opening')
            analysis = game.get('analysis')
            pgn = game.get('pgn')

            games.append(Game(
                id=game['id'],
                rated=game['rated'],
                variant=game['variant'],
                speed=game['speed'],
                perf=game['perf'],
                source=game['source'],
                createdAt=game['createdAt'],
                lastMoveAt=game['lastMoveAt'],
                moves=game['moves'],
                status=game['status'],
                whitePlayer=Player(
                    color='white',
                    name=white_player['user']['name'],
                    id=white_player['user']['id'],
                    rating=white_player['rating'],
                    ratingDiff=white_player['ratingDiff'],
                    analysis=PlayerAnalysis(
                        inaccuracy=white_player['analysis']['inaccuracy'],
                        mistake=white_player['analysis']['mistake'],
                        blunder=white_player['analysis']['blunder'],
                        acpl=white_player['analysis']['acpl'],
                        accuracy=white_player['analysis'].get('accuracy')
                    ) if white_player.get('analysis') else None
                ),
                blackPlayer=Player(
                    color='black',
                    name=black_player['user']['name'],
                    id=black_player['user']['id'],
                    rating=black_player['rating'],
                    ratingDiff=black_player['ratingDiff'],
                    analysis=PlayerAnalysis(
                        inaccuracy=black_player['analysis']['inaccuracy'],
                        mistake=black_player['analysis']['mistake'],
                        blunder=black_player['analysis']['blunder'],
                        acpl=black_player['analysis']['acpl'],
                        accuracy=black_player['analysis'].get('accuracy')
                    ) if black_player.get('analysis') else None
                ),
                winner=game.get('winner'),
                clocks=game.get('clocks'),
                clock=Clock(
                    initial=game['clock']['initial'],
                    increment=game['clock']['increment'],
                    totalTime=game['clock']['totalTime']
                ),
                division=Division(
                    middle=game['division'].get('middle'),
                    endgame=game['division'].get('endgame')
                ) if game.get('division') else None,
                pgn=pgn,
                analysis=analysis,
                opening=Opening(
                    eco=opening['eco'],
                    name=opening['name'],
                    ply=opening['ply']
                ) if opening else None
            ))

        return games


    def get_from_id(self, game_id: str) -> Game:
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

        response = self._client.request('GET', f'game/export/{game_id}', headers=headers).json()

        game = Game(
            id=response['id'],
            rated=response['rated'],
            variant=response['variant'],
            speed=response['speed'],
            perf=response['perf'],
            source=response['source'],
            createdAt=response['createdAt'],
            lastMoveAt=response['lastMoveAt'],
            moves=response['moves'],
            status=response['status'],
            whitePlayer=Player(
                color='white',
                name=response['players']['white']['user']['name'],
                id=response['players']['white']['user']['id'],
                rating=response['players']['white']['rating'],
                ratingDiff=response['players']['white']['ratingDiff'],
                analysis=PlayerAnalysis(
                    inaccuracy=response['players']['white']['analysis']['inaccuracy'],
                    mistake=response['players']['white']['analysis']['mistake'],
                    blunder=response['players']['white']['analysis']['blunder'],
                    acpl=response['players']['white']['analysis']['acpl'],
                    accuracy=response['players']['white']['analysis'].get('accuracy')
                ) if response['players']['white'].get('analysis') else None
            ),
            blackPlayer=Player(
                color='black',
                name=response['players']['black']['user']['name'],
                id=response['players']['black']['user']['id'],
                rating=response['players']['black']['rating'],
                ratingDiff=response['players']['black']['ratingDiff'],
                analysis=PlayerAnalysis(
                    inaccuracy=response['players']['black']['analysis']['inaccuracy'],
                    mistake=response['players']['black']['analysis']['mistake'],
                    blunder=response['players']['black']['analysis']['blunder'],
                    acpl=response['players']['black']['analysis']['acpl'],
                    accuracy=response['players']['black']['analysis'].get('accuracy')
                ) if response['players']['black'].get('analysis') else None
            ),
            winner=response.get('winner'),
            clocks=response.get('clocks'),
            clock=Clock(
                initial=response['clock']['initial'],
                increment=response['clock']['increment'],
                totalTime=response['clock']['totalTime']
            ),
            division=Division(
                middle=response['division']['middle'],
                endgame=response['division'].get('endgame')
            ) if response.get('division') else None,
            pgn=response.get('pgn'),
            analysis=[MoveAnalysis(
                    eval=move.get('eval'),
                    mat=move.get('mat'),
                    best=move.get('best'),
                    variation=move.get('variation'),
                    judgment=Judgment(
                        name=move['judgment']['name'],
                        comment=move['judgment']['comment']
                    ) if move.get('judgment') else None
                ) for move in response.get('analysis')]
            if response.get('analysis') else None,
            opening=Opening(
                eco=response['opening']['eco'],
                name=response['opening']['name'],
                ply=response['opening']['ply']
            )
        )

        return game
