import mongoose from 'mongoose'
import { followModel } from '~/models/model/follower.model'
import { userModel } from '~/models/model/user.model'

interface TUser {
  _id: string
  name: string
  avatar: string
  username: string
}

export const followServices = {
  follow: async (payload: { follower_id: string; following_id: string }) => {
    const findFollower = await followModel.findOne({
      follower_id: new mongoose.Types.ObjectId(payload.follower_id),
      following_id: new mongoose.Types.ObjectId(payload.following_id)
    })
    if (findFollower) {
      await followModel.deleteOne({
        follower_id: new mongoose.Types.ObjectId(payload.follower_id),
        following_id: new mongoose.Types.ObjectId(payload.following_id)
      })
      return {
        message: 'unFollow successfully',
        data: {}
      }
    } else {
      await followModel.create({
        follower_id: new mongoose.Types.ObjectId(payload.follower_id),
        following_id: new mongoose.Types.ObjectId(payload.following_id)
      })
      return {
        message: 'follow successfully',
        data: {}
      }
    }

  },
  getUser: async () => {
    const res = await userModel.aggregate<TUser[]>([
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          username: 1
        }
      }
    ])
    return {
      message: 'get user successfully',
      data: res
    }
  },
  getListFollow: async () => {
    const res = await followModel.find({})
    return {
      message: '',
      data: res
    }
  }
}
