import mongoose, { ObjectId, Schema } from 'mongoose'

export interface LikeType {
  user_id: ObjectId
  tweet_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

const LikeObjectID = mongoose.Types.ObjectId

export const likeSchema = new Schema<LikeType>(
  {
    user_id: { type: LikeObjectID, default: '' },
    tweet_id: { type: LikeObjectID, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'like'
  }
)

export default likeSchema
