import { Request, Response } from 'express'
import 'dotenv/config'
import { updateLichessAccount } from './main'

export const lichessSynchronizerFunction = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.body
    
    await updateLichessAccount(accountId)

    res.status(200).send('ok')
  } catch (error) {
    console.error(error)
    res.status(500).send('error')
  }
}
