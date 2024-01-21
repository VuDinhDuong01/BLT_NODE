import mongoose from 'mongoose'

import { likeModel } from '~/models/model/like.model'

export const likeServices = {
  like: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await likeModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'create like successfully',
      data: {}
    }
  },
  unLike: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await likeModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'delete like successfully',
      data: {}
    }
  },

  getList: async ({ user_id }: { user_id: string }) => {
    const result = await likeModel.find({ user_id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get list like successfully',
      data: result
    }
  }
}
