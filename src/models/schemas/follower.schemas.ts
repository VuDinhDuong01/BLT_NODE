import mongoose, { ObjectId, Schema } from 'mongoose'

export interface FollowType {
  follower_id: ObjectId
  following_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

const idType = mongoose.Types.ObjectId
export const followerSchema = new Schema<FollowType>(
  {
    follower_id: { type: idType, default: '' },
    following_id: { type: idType, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'follow'
  })

export default followerSchema