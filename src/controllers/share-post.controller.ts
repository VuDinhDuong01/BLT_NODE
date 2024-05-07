import { Request, Response } from 'express'
import { sharePostServices } from '~/services/sharePost.services'

export const sharePostController = {
  createSharePost: async (req: Request, res: Response) => {
    try {
      const { userId, postId , content, medias} = req.body
      const response = await sharePostServices.createSharePost({ userId, postId , content, medias})
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getSharePost: async (req: Request, res: Response) => {
    try {
      const response = await sharePostServices.getSharePost()
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
}
