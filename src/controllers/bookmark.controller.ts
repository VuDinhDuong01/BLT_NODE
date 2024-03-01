import { Request, Response } from 'express'

import { bookmarkServices } from '~/services/bookmark.services'
import { verify_access_token } from '~/type'

export const bookmarkController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await bookmarkServices.create({
        user_id: user_id,
        tweet_id: req.body.tweet_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { user_id, tweet_id } = req.body
      const response = await bookmarkServices.delete({
        user_id: user_id,
        tweet_id: tweet_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  get: async (req: Request, res: Response) => {
    const { user_id } = req.params 
    const { page, limit } = req.query
    try {
      const response = await bookmarkServices.getList({ user_id, limit: Number(limit), page: Number(page) })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
