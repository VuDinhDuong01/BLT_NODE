import { Request, Response } from 'express'
import { followServices } from '~/services/follower.services'
import { verify_access_token } from '~/type'
export const followController = {
  follow: async (req: Request, res: Response) => {
    try {
      const { following_id } = req.body
      const { user_id } = req.verify_access_token as verify_access_token
      const result = await followServices.follow({ following_id, follower_id: user_id })
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  },
  getListUser: async (req: Request, res: Response) => {
    try {
      const result = await followServices.getUser()
      return res.json(result)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getListFollow: async (req: Request, res: Response) => {
    try {
      const result = await followServices.getListFollow()
      return res.json(result)
    } catch (error: unknown) {
      console.log(error)
    }
  }
}
