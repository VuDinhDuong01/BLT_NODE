/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { conversationsModel } from '~/models/model/conversations.model';
import { notificationModel } from '~/models/model/notification.model';


export const notificationServices = {

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
  getNotification: async ({ user_id, limit, page }: { user_id: string, limit: string, page: string }) => {

    const res = await notificationModel.find({ receiver_id: new mongoose.Types.ObjectId(user_id) })
      .sort({ created_at: 1 })
      .skip(Number(limit) * (Number(page) - 1))
      .limit(Number(limit))
    const total_records = await notificationModel.countDocuments({ receiver_id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get notification successfully',
      data: res,
      limit: Number(limit),
      total_records: total_records,
      total_pages: Math.ceil(total_records / Number(limit)),
      current_page: Number(limit) * (Number(page) - 1)
    }
  }
}
