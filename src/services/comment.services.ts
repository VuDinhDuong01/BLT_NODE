import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'
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

  delete: async ({ user_id, _id }: { user_id: string; _id: string }) => {
    console.log({ user_id, _id })
    await commentModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      _id: new mongoose.Types.ObjectId(_id)
    })
    return {
      message: 'delete comment successfully',
      data: {}
    }
  },
  edit: async ({
    user_id,
    _id,
    content_comment,
    image_comment
  }: {
    user_id: string
    _id: string
    content_comment: string
    image_comment: string
  }) => {
    const res = await commentModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        _id: new mongoose.Types.ObjectId(_id)
      },
      {
        $set: {
          content_comment,
          image_comment
        },
        $currentDate:{
          updated_at: true
        }
      },
      {
        new: true
      }
    )
    return {
      message: 'update comment successfully',
      data: res
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
