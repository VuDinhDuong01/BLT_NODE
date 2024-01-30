/* eslint-disable prettier/prettier */
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
    const result = await bookmarkModel.aggregate(
      [
        {
          '$lookup': {
            'from': 'tweet', 
            'localField': 'user_id', 
            'foreignField': 'user_id', 
            'as': 'bookmark'
          }
        }, {
          '$lookup': {
            'from': 'tweet', 
            'localField': 'tweet_id', 
            'foreignField': '_id', 
            'as': 'bookmark'
          }
        }, {
          '$lookup': {
            'from': 'like', 
            'localField': 'tweet_id', 
            'foreignField': 'tweet_id', 
            'as': 'like'
          }
        }, {
          '$addFields': {
            'like_count': {
              '$size': '$like'
            }
          }
        }, {
          '$project': {
            'like': 0, 
            '_id': 0, 
            'user_id': 0, 
            'tweet_id': 0, 
            'created_at': 0, 
            'updated_at': 0, 
            '__v': 0
          }
        }
      ]
    )
    return {
      message: 'get list bookmark successfully',
      data: result
    }
  }
}
