/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'

import { sharePostModel } from '~/models/model/share-post'


export const sharePostServices = {
  createSharePost: async ({
    userId, postId, content, medias
  }: { userId: string, postId: string , content: string , medias: string[]}) => {

    const res = await sharePostModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      postId: new mongoose.Types.ObjectId(postId),
      content,
      medias
    })
    return {
      message: 'create share post successfully',
      data: {}
    }
  },
  getSharePost: async () => {
    const response = await sharePostModel.aggregate([
      {
        '$lookup': {
          'from': 'users',
          'localField': 'userId',
          'foreignField': '_id',
          'as': 'info_user_share'
        }
      }, {
        '$unwind': {
          'path': '$info_user_share'
        }
      }, {
        '$lookup': {
          'from': 'tweet',
          'localField': 'postId',
          'foreignField': '_id',
          'as': 'information_post'
        }
      }, {
        '$unwind': {
          'path': '$information_post'
        }
      }, {
        '$project': {
          '_id': 1,
          'created_at': 1,
          'updated_at': 1,
          'info_user_share': {
            'name': '$info_user_share.name',
            'username': '$info_user_share.username',
            'avatar': '$info_user_share.avatar'
          },
          'information_post': 1
        }
      }
    ])
    return {
      message: 'get share post successfully',
      data: response
    }
  }
}
