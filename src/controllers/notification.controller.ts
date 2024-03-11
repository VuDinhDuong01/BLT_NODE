import { Request, Response } from 'express'
import { conversationsServices } from '~/services/conversations.services'
import { notificationServices } from '~/services/notification.services'

import { verify_access_token } from '~/type'

export const notificationController = {

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
    const { user_id } = req.params
    const { limit, page } = req.query
    try {
      const result = await notificationServices.getNotification({
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
