/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { conversationsModel } from '~/models/model/conversations.model';


export const conversationsServices = {

  delete: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await conversationsModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'delete conversations successfully',
      data: {}
    }
  },
  getConversations: async ({ receiver_id, user_id, limit, page }: { receiver_id: string, user_id: string, limit: string, page: string }) => {
    const matches = { $or: [{ receiver_id: new mongoose.Types.ObjectId(receiver_id), sender_id: new mongoose.Types.ObjectId(user_id) }, { sender_id: new mongoose.Types.ObjectId(receiver_id), receiver_id: new mongoose.Types.ObjectId(user_id) }] }
    const res = await conversationsModel.find(matches)
      .sort({ created_at: 1 })
      .skip(Number(limit) * (Number(page) - 1))
      .limit(Number(limit))
    const total_records = await conversationsModel.countDocuments(matches)
    return {
      message: 'get conversations successfully',
      data: res,
      limit: Number(limit),
      total_records: total_records,
      total_pages: Math.ceil(total_records / Number(limit)),
      current_page: Number(limit) * (Number(page) - 1)
    }
  }
}
