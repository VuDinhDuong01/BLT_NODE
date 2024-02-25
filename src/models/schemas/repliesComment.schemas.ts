import mongoose, { ObjectId, Schema } from 'mongoose'

export interface RepliesCommentType {
  user_id: ObjectId
  replies_comment_id: ObjectId
  replies_content_comment?: string
  replies_image_comment?: string
  replies_like_comments?: { id: ObjectId; icon: string }[]
  created_at?: Date
  updated_at?: Date
}

const commentObjectID = mongoose.Types.ObjectId

export const repliesCommentSchema = new Schema<RepliesCommentType>(
  {
    user_id: { type: commentObjectID, default: '' },
    replies_comment_id: { type: commentObjectID, default: '' },
    replies_content_comment: { type: String, default: '' },
    replies_image_comment: { type: String, default: '' },
    replies_like_comments: { type: [{ id: commentObjectID, icon: String }], default: [] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'replies_comment'
  }
)
