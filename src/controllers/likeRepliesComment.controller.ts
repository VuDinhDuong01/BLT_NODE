import { Request, Response } from 'express'

import { repliesLikeCommentServices } from '~/services/likeRepliesComment.services'

export const repliesLikeCommentController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id, replies_comment_id } = req.body
      const response = await repliesLikeCommentServices.create({
        user_id,
        replies_comment_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
