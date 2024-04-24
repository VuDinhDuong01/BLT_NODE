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
      const { tweet_id } = req.params
      const { limit, page } = req.query
      const response = await commentServices.getListCommentWithTweet({
        tweet_id,
        limit: limit as string,
        page: page as string
      })
      return res.json(response)
    } catch (error: unknown) {
      console.log(error)
    }
  },
  getAllComment: async (req: Request, res: Response) => {
    const { page, limit, name, sort_by, order } = req.query
    const result = await commentServices.getAllComment({
      page: page as string,
      limit: limit as string,
      name: name as string | null,
      sort_by: sort_by as string,
      order: order as string
    })
    return res.json(result)
  },
  deleteComment: async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body
      const result = await commentServices.deleteComment(user_id)
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  },
  deleteManyComment: async (req: Request, res: Response) => {
    try {
      const { manyId } = req.body
      const result = await commentServices.deleteManyComment(manyId)
      return res.json(result)
    } catch (err) {
      console.log(err)
    }
  }
}
