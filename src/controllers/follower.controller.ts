import { Request, Response } from 'express'
import { followServices } from '~/services/follower.services'
import { verify_access_token } from '~/type'
export const followrController = {
  follow: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { user_id } = req.verify_access_token as verify_access_token
      const result = await followServices.follow({ followered: id, follower: user_id })
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  },
  unFollow: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { user_id } = req.verify_access_token as verify_access_token
      const result = await followServices.unFollow({ followered: id, follower: user_id })
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  }
}
