import { Request, Response } from 'express'
import { TweetServices } from '~/services/tweet.services'
import { verify_access_token } from '~/type'

export const TweetController = {
  createTweet: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const { hashtags, content, audience, mentions, medias } = req.body
      const response = await TweetServices.createTweet({
        hashtags,
        content,
        audience,
        mentions,
        medias,
        user_id: user_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getTweetDetail: async (req: Request, res: Response) => {
    const { tweet_id } = req.params
    const { user_id } = req.verify_access_token as verify_access_token
    const views = await TweetServices.increaseViews({ user_id, tweet_id })
    try {
      const response = await TweetServices.getTweetDetail({ tweet_id, user_id })
      const result = {
        ...response,
        user_views: views.user_views,
        guest_views: views.guest_views
      }
      return res.json({
        message: 'get detail tweet successfully',
        data: result
      })
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getListTweet: async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query
      const response = await TweetServices.getListTweet({ limit: limit as string, page: page as string })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
