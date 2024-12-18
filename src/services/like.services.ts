import mongoose from 'mongoose'

import { likeModel } from '~/models/model/like.model'

export const likeServices = {
  like: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await likeModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
    })
    return {
      message: 'create like successfully',
      data: {}
    }
  },
  unLike: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await likeModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
    })
    return {
      message: 'delete like successfully',
      data: {}
    }
  },

  getList: async ({ user_id }: { user_id: string }) => {
    const result = await likeModel.find({ user_id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get list like successfully',
      data: result
    }
  },
  getAllLike: async ({
    limit,
    page,
    name,
    sort_by,
    order
  }: {
    limit: string
    page: string
    name?: string | null
    sort_by?: string | null
    order?: string
  }) => {
    const $match: any[] = []

    if (name) {
      $match.push({
        $match: {
          $text: {
            $search: name
          }
        }
      })
    }
    $match.push({
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    })
    $match.push({
      $lookup: {
        from: "tweet",
        localField: "tweet_id",
        foreignField: "_id",
        as: "tweet"
      }
    })
    $match.push({
      $sort: { created_at: -1 }
    })
    if (sort_by === 'name') {
      const sortOrder = order === 'asc' ? 1 : -1
      const sortObject: any = {}
      sortObject['name'] = sortOrder
      $match.push({
        $sort: sortObject
      })
    }
    $match.push({
      $skip: Number(limit) * (Number(page) - 1)
    })
    $match.push({
      $limit: Number(limit)
    })
    const queryCount: any = {}
    if (name) {
      queryCount['$text'] = { $search: name }
    }
    const response = await likeModel.aggregate($match)
    const totalItem = await likeModel.countDocuments(queryCount)

    return {
      message: 'get like successfully',
      data: response,
      total_page: Math.ceil(totalItem / Number(limit))
    }
  },

  deleteLike: async (user_id: string) => {
    await likeModel.deleteOne({ _id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'delete like successfully'
    }
  },
  deleteManyLike: async (arrayIdPost: string[]) => {
    const ObjectId = arrayIdPost.map((item) => new mongoose.Types.ObjectId(item))
    await likeModel.deleteMany({ _id: { $in: ObjectId } })
    return {
      message: 'delete  many like successfully'
    }
  },
}
