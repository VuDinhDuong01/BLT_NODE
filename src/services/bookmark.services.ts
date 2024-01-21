import mongoose from 'mongoose'
import { bookmarkModel } from '~/models/model/bookmark.model'

export const bookmarkServices = {
  create: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await bookmarkModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'create bookmark successfully',
      data: {}
    }
  },
  delete: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await bookmarkModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'delete bookmark successfully',
      data: {}
    }
  },

  getList: async ({ user_id }: { user_id: string }) => {
    const result = await bookmarkModel.find({ user_id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get list bookmark successfully',
      data: result
    }
  }
}
