import { Request, Response } from 'express'

import { likeServices } from '~/services/like.services'
import { verify_access_token } from '~/type'

export const likeController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await likeServices.like({
        user_id: user_id,
        tweet_id: req.body.tweet_id
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.verify_access_token as verify_access_token
      const response = await likeServices.unLike({
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
      const response = await likeServices.getList({ user_id })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getAllLike: async (req: Request, res: Response) => {
    const { page, limit, name, sort_by, order } = req.query
    const result = await likeServices.getAllLike({
      page: page as string,
      limit: limit as string,
      name: name as string | null,
      sort_by: sort_by as string,
      order: order as string
    })
    return res.json(result)
  },
  deleteLike: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body
      const result = await likeServices.deleteLike(user_id)
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  },
  deleteManyLike: async (req: Request, res: Response) => {
    try {
      const { manyId } = req.body
      const result = await likeServices.deleteManyLike(manyId)
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  }
}
