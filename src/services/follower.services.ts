import mongoose from 'mongoose'
import { followModel } from '~/models/model/follower.model'

export const followServices = {
  follow: async (payload: { follower: string; following_id: string }) => {
     await followModel.create({
      follower_id: new mongoose.Types.ObjectId(payload.follower),
      following_id: new mongoose.Types.ObjectId(payload.following_id)
    })
    return {
      message: 'follow successfully'
    }
  },
  unFollow: async (payload: { follower: string; following_id: string }) => {
    await followModel.deleteOne({
      follower_id: new mongoose.Types.ObjectId(payload.follower),
      following_id: new mongoose.Types.ObjectId(payload.following_id)
    })
    return {
      message: 'unFollow successfully'
    }
  }
}
