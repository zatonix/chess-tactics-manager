import { Request, Response } from 'express'
import 'dotenv/config'
import { chessAnalysis } from './main'

export const chessAnalysisFunction = async (req: Request, res: Response) => {
  try {
    const { pgn } = req.body
    
    await chessAnalysis(pgn)

    res.status(200).send('ok')
  } catch (error) {
    console.error(error)
    res.status(500).send('error')
  }
}

chessAnalysis('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. a4 Bg7 16. Bg5 h6 17. Bd2 c5 18. d5 c4 19. Be3 Qc7 20. Qd2 h5 21. Bh6 Bh8 22. Nh4 Nc5 23. Rf1 Nh7 24. f4 exf4 25. Rxf4 Be5 26. Rf3 Qe7 27. Nhf5 gxf5 28. Nxf5 Qf6 29. Bg7 Qg5 30. Qxg5 Nxg5 31. Bxe5 Nxf3+ 32. gxf3 dxe5 33. Kf2 Kh7 34. Nd6 Rg8 35. Nxf7 Rae8 36. axb5 axb5 37. Ra5 Rg7 38. Nd6 Reg8 39. Rxb5 Rg2+ 40. Ke3 Rxc2 41. Rxc5 Rgg2 42. Rc7+ Kg6 43. f4 Rg3# 0-1')