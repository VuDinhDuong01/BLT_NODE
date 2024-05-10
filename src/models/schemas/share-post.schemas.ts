import mongoose, { ObjectId, Schema } from 'mongoose'

export interface SharePostType {
  postId: ObjectId
  created_at?: Date
  updated_at?: Date
}

const SharePostObjectID = mongoose.Types.ObjectId

const SharePostSchema = new Schema<SharePostType>(
  {
    postId: { type: SharePostObjectID, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'share_post'
  }
)

export default SharePostSchema
