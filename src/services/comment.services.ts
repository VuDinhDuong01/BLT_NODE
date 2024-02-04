import { check } from 'express-validator'
import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'
import { likeCommentModel } from '~/models/model/like_comment'
interface CommentProps {
  user_id: string
  tweet_id: string
  content_comment?: string
  image_comment?: string[]
 
}

export const commentServices = {
  create: async ({ user_id, tweet_id, content_comment, image_comment }: CommentProps) => {
    await commentModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
      content_comment,
      image_comment
    })
    return {
      message: 'create comment successfully',
      data: {}
    }
  },

  delete: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await commentModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'delete bookmark successfully',
      data: {}
    }
  },

  getList: async ({ user_id }: { user_id: string }) => {
    const result = await commentModel.find({ user_id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get list bookmark successfully',
      data: result
    }
  }
}
