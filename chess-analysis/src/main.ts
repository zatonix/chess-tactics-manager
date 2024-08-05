import { Engine } from 'node-uci'
import { Chess, Move } from 'chess.js'

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const DEPTH = 16; 

interface MoveAnalysis {
    bestmove: string;
    analysis: any[];
    score: { value: number, unit: string };
}

const categorizeMove = async (before: MoveAnalysis, after: MoveAnalysis, _move: Move, _chess: Chess) => {
    
    let val = after.score.value*-1;

        if(before.score.value < val){
            return 'excellent'
        }

        if(before.score.value < val+70){
            return 'good'
        }

        if(before.score.value < val+150){
            return 'imprecision'
        }

        if(before.score.value < val+300){
            return 'mistake'
        }

        return 'blunder'
}

const getScore = (data: any[]): { value: number, unit: string } => {
    data.sort((a, b) => {
        if(a.score.unit != 'cp' && b.score.unit != 'cp'){
            if(a.score.value >= 0 && b.score.value >= 0) return ( a.score.value - b.score.value ) * -1
            if(a.score.value >= 0) return 1;
            if(b.score.value >= 0) return -1;
            return ( a.score.value - b.score.value ) * -1;
        }
        if(a.score.unit != 'cp' && b.score.unit == 'cp'){
            if(a.score.value >= 0) return 1;
            return -1;
        }
        if(a.score.unit == 'cp' && b.score.unit != 'cp'){
            if(b.score.value >= 0) return -1;
            return 1;
        }
        return a.score.value - b.score.value
    });
    data.reverse();
    return data[0].score;
}

const analysis_move = async (engine: Engine, pos: string = START_FEN, depth: number = DEPTH): Promise<MoveAnalysis | undefined> => {
    await engine.position(pos);
    const result = await engine.go({ depth });
    
    if(result.bestmove == '(none)'){
        return undefined
    }

    const data : MoveAnalysis = {
        bestmove: result.bestmove,
        analysis: result.info.slice(-3),
        score: { value: 0, unit: 'cp' }
    }
   
    for(let i in data.analysis){
        data.analysis[i].move = data.analysis[i].pv.split(' ').shift();
    }

    return data;
}


export const chessAnalysis = async (pgn: string) => {
  const engine = new Engine('bin/stockfish');
    await engine.init();
    await engine.setoption('MultiPV', '1')
    await engine.setoption('Skill Level', '20')
    await engine.setoption('Threads', '1')
    const chess = new Chess();
    chess.loadPgn(pgn);
    let history = chess.history({ verbose: true });
    console.log(history.map((move: any) => move.san).join(' '));

    const CHESS = new Chess();
    const CHESSB = new Chess();

    console.log('start')
    let before = await analysis_move(engine, START_FEN, DEPTH);
    for(let move of history){
        CHESSB.move(move.san);
        const after = await analysis_move(engine, CHESSB.fen(), DEPTH);
        if(!after) {
            break
            
        }
        after.score = getScore(after.analysis);

        let category = await categorizeMove(before!, after, move, CHESS);
        console.log(move.san, category, after.score.value, after.score.unit, 
            (['blunder', 'mistake', 'imprecision'].includes(category) ? 
            `bestmove was ${after.bestmove} with variant: ${after.analysis[0].pv}`  : 
            ''));

        CHESS.move(move.san);
        before = after;
        
    }   
    console.log('end')
    await engine.quit();   
}