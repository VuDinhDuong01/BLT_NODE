/* eslint-disable prettier/prettier */
import mongoose, { ObjectId, Schema } from 'mongoose'

export interface ConversationType {
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
}

const conversationsObjectID = mongoose.Types.ObjectId

export const conversationsSchema = new Schema<ConversationType>(
  {
    sender_id: { type: conversationsObjectID, default: '' },
    receiver_id: { type: conversationsObjectID, default: '' },
    content: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'conversations'
  }
)

export default conversationsSchema
