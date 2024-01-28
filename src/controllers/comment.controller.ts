import { Request, Response } from 'express'

import { commentServices } from '~/services/comment.services'
import { verify_access_token } from '~/type'

export const commentController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const { tweet_id, content, image, content_replies, image_replies } = req.body
      const response = await commentServices.create({
        user_id: user_id,
        tweet_id: tweet_id,
        content: content,
        image: image,
        content_replies,
        image_replies,
       
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await commentServices.delete({
        user_id: user_id,
        tweet_id: req.body.tweet_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  edit: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await commentServices.delete({
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
      const response = await commentServices.getList({ user_id })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
