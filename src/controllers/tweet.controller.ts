import { Request, Response } from 'express'
import { TweetServices } from '~/services/tweet.services'
import { verify_access_token } from '~/type'

export const TweetController = {
  createTweet: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const { type, hashtags, content, audience, mentions, medias } = req.body
      const response = await TweetServices.createTweet({
        type,
        hashtags,
        content,
        audience,
        mentions,
        medias,
        user_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
