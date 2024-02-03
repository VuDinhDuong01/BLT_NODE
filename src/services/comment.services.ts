import { check } from 'express-validator'
import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'
interface CommentProps {
  user_id: string
  tweet_id: string
  content_comment?: string
  image_comment?: string[]
  like_comment?: string[]
  user_like?: string
}

export const commentServices = {
  create: async ({ user_id, tweet_id, content_comment, image_comment}: CommentProps) => {
    // const checkUserLike = like_comment?.includes(user_like as string)
    // if (checkUserLike) {
    //   like_comment?.filter(item => item !== user_like)
    // } else {
    //   like_comment?.push(user_like as string)
    // }
    await commentModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
      content_comment,
      image_comment,
      // like_comment
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
