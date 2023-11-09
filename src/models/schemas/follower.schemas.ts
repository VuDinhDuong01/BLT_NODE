import mongoose, { ObjectId, Schema } from 'mongoose'

interface FolloweType {
  follower_id: ObjectId,
  followered_id: ObjectId,
  created_at: Date,
  updated_at: Date
}

const idType = mongoose.Types.ObjectId
export const followerSchema = new Schema<FolloweType>(
  {
    follower_id: { type: idType, default: '' },
    followered_id: { type: idType, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'follower'
  })

export default followerSchema