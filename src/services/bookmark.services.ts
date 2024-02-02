/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { bookmarkModel } from '~/models/model/bookmark.model'

export const bookmarkServices = {
  create: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await bookmarkModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
      status:true
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
            'from': 'like', 
            'localField': '_id', 
            'foreignField': 'tweet_id', 
            'as': 'likes'
          }
        }, {
          '$addFields': {
            'like_count': {
              '$size': '$likes'
            }
          }
        }, {
          '$unwind': {
            'path': '$likes', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'content': 1, 
            'user_id': 1, 
            'hashtags': 1, 
            'mentions': 1, 
            'medias': 1, 
            'audience': 1, 
            'user_views': 1, 
            'guest_views': 1, 
            'like_count': 1, 
            'likes': {
              'status': '$likes.status'
            }
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'user_id', 
            'foreignField': '_id', 
            'as': 'users'
          }
        }, {
          '$addFields': {
            'user': {
              '$map': {
                'input': '$users', 
                'as': 'user', 
                'in': {
                  'name': '$$user.name', 
                  'username': '$$user.username', 
                  'avatar': '$$user.avatar', 
                  'bio': '$$user.bio'
                }
              }
            }
          }
        }, {
          '$project': {
            'users': 0
          }
        }, {
          '$lookup': {
            'from': 'bookmark', 
            'localField': '_id', 
            'foreignField': 'tweet_id', 
            'as': 'bookmark'
          }
        }, {
          '$unwind': {
            'path': '$bookmark', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'content': 1, 
            'user_id': 1, 
            'hashtags': 1, 
            'mentions': 1, 
            'medias': 1, 
            'audience': 1, 
            'user_views': 1, 
            'guest_views': 1, 
            'likes': 1, 
            'like_count': 1, 
            'bookmark': {
              'status': '$bookmark.status'
            }
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
