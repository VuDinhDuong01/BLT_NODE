import mongoose, { ObjectId, Schema } from 'mongoose'

export interface LikeCommentType {
  comment_id: ObjectId
  like_comment: ObjectId[]
  user_like?: ObjectId
  created_at?: Date
  updated_at?: Date
}

const commentObjectID = mongoose.Types.ObjectId

const LikeCommentSchema = new Schema<LikeCommentType>(
  {
    comment_id: { type: commentObjectID, default: '' },
    like_comment: { type: [commentObjectID], default: [] },
    user_like: { type: commentObjectID, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'like_comment'
  }
)

export default LikeCommentSchema
