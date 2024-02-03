import { Request, Response } from 'express'

import { commentServices } from '~/services/comment.services'
import { repliesCommentServices } from '~/services/repliesComment.services'
import { verify_access_token } from '~/type'

export const repliesCommentController = {
  create: async (req: Request, res: Response) => {
    try {
      const { replies_comment_id, user_id, replies_content_comment, replies_image_comment } = req.body
      const response = await repliesCommentServices.create({
        user_id,
        replies_comment_id,
        replies_content_comment,
        replies_image_comment
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
