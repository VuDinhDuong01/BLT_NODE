import { Request, Response } from 'express'

import { likeCommentServices } from '~/services/likeComment.services'

export const likeCommentController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id, comment_id } = req.body
      const response = await likeCommentServices.create({
        user_id,
        comment_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
