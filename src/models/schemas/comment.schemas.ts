import mongoose, { ObjectId, Schema } from 'mongoose'

export interface replies {
  content_replies?: string
  image_replies?: string
  like_replies?: ObjectId
}

export interface CommentType {
  user_id: ObjectId
  tweet_id: ObjectId
  content: string
  likes?: ObjectId[]
  replies?: replies[]
  image?: string
  created_at?: Date
  updated_at?: Date
}

const commentObjectID = mongoose.Types.ObjectId

export const commentSchema = new Schema<CommentType>(
  {
    user_id: { type: commentObjectID, default: '' },
    tweet_id: { type: commentObjectID, default: '' },
    likes: { type: [commentObjectID], default: [] },
    replies: {
      type: [{ content_replies: String, image_replies: String, like_replies: Schema.Types.ObjectId }],
      default: []
    },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'comment'
  }
)

export default commentSchema
