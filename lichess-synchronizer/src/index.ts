import { Request, Response } from 'express'
import 'dotenv/config'
import { updateLichessAccount } from './main'

/* 
  * This function is the entry point for the synchronizer function. It receives a POST request with the accountId of the account to be updated.
  * It calls the updateLichessAccount function with the accountId and sends a response based on the result.
*/
export const lichessSynchronizerFunction = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.body
    await updateLichessAccount(accountId)
    res.status(200).send('ok')
  } catch (error) {
    console.error(`Error in lichessSynchronizerFunction: ${error}`)
    res.status(500).send(error)
  }
}
