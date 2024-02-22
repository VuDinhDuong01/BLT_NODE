import { Request, Response } from 'express'

import { commentServices } from '~/services/comment.services'
import { verify_access_token } from '~/type'

export const commentController = {
  create: async (req: Request, res: Response) => {
    try {
      const { tweet_id, user_id, content_comment, image_comment } = req.body
      const response = await commentServices.create({
        user_id,
        tweet_id,
        content_comment,
        image_comment
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
        _id: req.body._id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  edit: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const { content_comment, image_comment, _id } = req.body
      const response = await commentServices.edit({
        user_id,
        _id,
        content_comment,
        image_comment
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getList: async (req: Request, res: Response) => {
    try {
      const { tweet_id, limit, page } = req.body
      const response = await commentServices.getListCommentWithTweet({
        tweet_id,
        limit: limit as string,
        page: page as string
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
