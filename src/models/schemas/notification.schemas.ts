/* eslint-disable prettier/prettier */
import mongoose, { ObjectId, Schema } from 'mongoose'

export interface NotificationType {
  sender_id?: ObjectId
  receiver_id: ObjectId
  tweet_id?: ObjectId
  status: string
  username: string
  avatar: string
  created_at?: Date
  updated_at?: Date
}

const notificationObjectID = mongoose.Types.ObjectId

export const notificationSchema = new Schema<NotificationType>(
  {
    sender_id: { type: notificationObjectID, default: null },
    receiver_id: { type: notificationObjectID, default: null },
    tweet_id: { type: notificationObjectID, default: null },
    status: { type: String, default: '' },
    username: { type: String, default: '' },
    avatar: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: 'notifications'
  }
)

export default notificationSchema
