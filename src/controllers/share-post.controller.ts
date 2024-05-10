import { Request, Response } from 'express'
import { sharePostServices } from '~/services/sharePost.services'

export const sharePostController = {
  createSharePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.body
      const response = await sharePostServices.createSharePost({ postId })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
