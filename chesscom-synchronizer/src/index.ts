import { Request, Response } from 'express'
import 'dotenv/config'
import { updateChesscomAccount } from './main'

/*
  * This function is the entry point for the synchronizer function. It receives a POST request with the accountId of the account to be updated.
  * It calls the updateChesscomAccount function with the accountId and sends a response based on the result.
*/
export const chesscomSynchronizerFunction = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.body
    await updateChesscomAccount(accountId)
    res.status(200).send('ok')
  } catch (error) {
    console.error(`Error in chesscomSynchronizerFunction: ${error}`)
    res.status(500).send(error)
  }
}

updateChesscomAccount('clziyxk2k0003nui2w3a1xild')