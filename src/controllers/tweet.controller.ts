import { Request, Response } from 'express'
import { TweetServices } from '~/services/tweet.services'
import { verify_access_token } from '~/type'

export const TweetController = {
  createTweet: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const {
        hashtags,
        content,
        audience,
        mentions,
        medias,
        medias_share,
        username_share,
        content_share,
        check_share,
        avatar_share,
        postId
      } = req.body
      const response = await TweetServices.createTweet({
        hashtags,
        content,
        audience,
        mentions,
        medias,
        user_id: user_id,
        medias_share,
        username_share,
        content_share,
        check_share,
        avatar_share,
        postId
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
      const response = await TweetServices.getTweetDetail({ tweet_id })
      // const result = {
      //   ...response,
      //   user_views: views.user_views,
      //   guest_views: views.guest_views
      // }
      return res.json({
        message: 'get detail tweet successfully',
        data: response
      })
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getListTweet: async (req: Request, res: Response) => {
    try {
      const { page, limit, title_tweet, id_user } = req.query
      const response = await TweetServices.getListTweet({
        limit: limit as string,
        page: page as string,
        title_tweet: title_tweet as string,
        id_user: id_user as string
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },

  getAllTweet: async (req: Request, res: Response) => {
    const { page, limit, name, sort_by, order } = req.query
    const result = await TweetServices.getAllTweet({
      page: page as string,
      limit: limit as string,
      content: name as string | null,
      sort_by: sort_by as string,
      order: order as string
    })
    return res.json(result)
  },
  deleteTweet: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body
      const result = await TweetServices.deleteTweet(user_id)
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  },
  deleteManyTweet: async (req: Request, res: Response) => {
    try {
      const { manyId } = req.body
      const result = await TweetServices.deleteManyTweet(manyId)
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  }
}
