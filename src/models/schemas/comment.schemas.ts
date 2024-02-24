import mongoose, { ObjectId, Schema } from 'mongoose'

export interface CommentType {
  user_id: ObjectId
  tweet_id: ObjectId
  content_comment?: string
  image_comment?: string
  created_at?: Date
  updated_at?: Date
}

const commentObjectID = mongoose.Types.ObjectId

export const commentSchema = new Schema<CommentType>(
  {
    user_id: { type: commentObjectID, default: '' },
    tweet_id: { type: commentObjectID, default: '' },
    content_comment: { type: String, default: '' },
    image_comment: { type: String , default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'comment'
  }
)

export default commentSchema
