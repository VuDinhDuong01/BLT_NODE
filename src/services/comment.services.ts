import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'

interface CommentProps {
  user_id: string
  tweet_id: string
  content: string
  image?: string
  likes?: string
  content_replies?: string
  image_replies?: string
}

export const commentServices = {
  create: async ({ user_id, tweet_id, content, image, content_replies, image_replies }: CommentProps) => {
    const newUser_id = new mongoose.Types.ObjectId(user_id)
    await commentModel.create({
      user_id: newUser_id,
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
      content,
      image,
      likes: [newUser_id],
      replies: [
        {
          content_replies: content_replies,
          image_replies: image_replies,
          like_replies: newUser_id
        }
      ]
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
