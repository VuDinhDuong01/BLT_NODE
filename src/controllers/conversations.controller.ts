import { Request, Response } from 'express'
import { conversationsServices } from '~/services/conversations.services'

import { verify_access_token } from '~/type'

export const conversationsController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const { receiver_id } = req.params
      const { content, images } = req.body
      const response = await conversationsServices.create({
        sender_id: user_id,
        receiver_id: receiver_id,
        content,
        images
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { user_id, tweet_id } = req.body
      const response = await conversationsServices.delete({
        user_id: user_id,
        tweet_id: tweet_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getConversations: async (req: Request, res: Response) => {
    const { receiver_id } = req.params
    const { user_id } = req.verify_access_token as verify_access_token
    const { limit, page } = req.query
    try {
      const result = await conversationsServices.getConversations({
        receiver_id,
        user_id,
        limit: String(limit),
        page: String(page)
      })
      return res.json(result)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
