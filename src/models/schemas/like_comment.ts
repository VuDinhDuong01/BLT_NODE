import mongoose, { ObjectId, Schema } from 'mongoose'

export interface LikeCommentType {
  comment_id: ObjectId
  user_id: ObjectId
  icon ?: string
  created_at?: Date
  updated_at?: Date
}

const commentObjectID = mongoose.Types.ObjectId

const LikeCommentSchema = new Schema<LikeCommentType>(
  {
    comment_id: { type: commentObjectID, default: '' },
    user_id: { type: commentObjectID, default: '' },
    icon: { type: String, default: ''},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'like_comment'
  }
)

export default LikeCommentSchema
