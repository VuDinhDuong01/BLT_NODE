import mongoose, { ObjectId, Schema } from 'mongoose'

export interface RepliesLikeCommentType {
  replies_comment_id: ObjectId
  user_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

const commentObjectID = mongoose.Types.ObjectId

const RepliesLikeCommentSchema = new Schema<RepliesLikeCommentType>(
  {
    replies_comment_id: { type: commentObjectID, default: '' },
    user_id: { type: commentObjectID, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'replies_like_comment'
  }
)

export default RepliesLikeCommentSchema
