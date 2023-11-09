import mongoose from 'mongoose'
import { followModel } from '~/models/model/follower.model'

export const followServices = {
  follow: async (payload: { follower: string; followered: string }) => {
     await followModel.create({
      follower_id: new mongoose.Types.ObjectId(payload.follower),
      followered_id: new mongoose.Types.ObjectId(payload.followered)
    })
    return {
      message: 'follow successfully'
    }
  },
  unFollow: async (payload: { follower: string; followered: string }) => {
    await followModel.deleteOne({
      follower_id: new mongoose.Types.ObjectId(payload.follower),
      followered_id: new mongoose.Types.ObjectId(payload.followered)
    })
    return {
      message: 'unfollower successfully'
    }
  }
}
