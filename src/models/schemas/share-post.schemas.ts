import mongoose, { ObjectId, Schema } from 'mongoose'

export interface SharePostType {
  userId: ObjectId
  postId: ObjectId
  content: string
  medias: string[]
  created_at?: Date
  updated_at?: Date
}

const SharePostObjectID = mongoose.Types.ObjectId

const SharePostSchema = new Schema<SharePostType>(
  {
    userId: { type: SharePostObjectID, default: '' },
    postId: { type: SharePostObjectID, default: '' },
    content: { type: String, default: '' },
    medias: { type: [String], default: [] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'share_post'
  }
)

export default SharePostSchema
