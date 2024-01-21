import mongoose, { ObjectId, Schema } from 'mongoose'

export interface BookMarkType {
  user_id: ObjectId
  tweet_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

const bookMarkObjectID = mongoose.Types.ObjectId

export const bookmarkSchema = new Schema<BookMarkType>(
  {
    user_id: { type: bookMarkObjectID, default: '' },
    tweet_id: { type: bookMarkObjectID, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'bookmark'
  }
)

export default bookmarkSchema
