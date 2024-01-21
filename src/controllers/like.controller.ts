import { Request, Response } from 'express'

import { likeServices } from '~/services/like.services'
import { verify_access_token } from '~/type'

export const likeController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await likeServices.like({
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
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await likeServices.unLike({
        user_id: user_id,
        tweet_id: req.body.tweet_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  get: async (req: Request, res: Response) => {
    const { user_id } = req.verify_access_token as verify_access_token
    try {
      const response = await likeServices.getList({ user_id })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
