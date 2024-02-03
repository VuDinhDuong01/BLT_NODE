import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'
import { repliesCommentModel } from '~/models/model/repliesComment.model'

interface CommentProps {
  user_id: string
  replies_comment_id: string
  replies_content_comment?: string
  replies_image_comment?: string[]
}

export const repliesCommentServices = {
  create: async ({ user_id, replies_comment_id, replies_content_comment, replies_image_comment }: CommentProps) => {
    await repliesCommentModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      replies_comment_id: new mongoose.Types.ObjectId(replies_comment_id),
      replies_content_comment,
      replies_image_comment
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
