/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { bookmarkModel } from '~/models/model/bookmark.model'
import { GenerateType } from '~/types/generate';
import { TweetDetail } from '~/types/tweet.types';

export const bookmarkServices = {
  create: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await bookmarkModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
    })
    return {
      message: 'create bookmark successfully',
      data: {}
    }
  },
  delete: async ({ user_id, tweet_id }: { user_id: string; tweet_id: string }) => {
    await bookmarkModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id)
    })
    return {
      message: 'delete bookmark successfully',
      data: {}
    }
  },

  getList: async ({ user_id, limit, page }: { user_id: string, limit: number, page: number }) => {
    const [listTweet, total_records] = await Promise.all([
      bookmarkModel.aggregate(
        [
          {
            '$match': {
              'user_id': new mongoose.Types.ObjectId(user_id)
            }
          }, {
            '$lookup': {
              'from': 'tweet',
              'localField': 'tweet_id',
              'foreignField': '_id',
              'as': 'tweet'
            }
          }, {
            '$unwind': {
              'path': '$tweet',
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$project': {
              '_id': 1,
              'user_id': 1,
              'tweet_id': 1,
              'created_at': 1,
              'updated_at': 1,
              'tweet_ids': '$tweet._id',
              'content': '$tweet.content',
              'hashtags': '$tweet.hashtags',
              'mentions': '$tweet.mentions',
              'audience': '$tweet.audience',
              'user_view': '$tweet.user_view',
              'guest_view': '$tweet.guest_view'
            }
          },
          {
            $lookup: {
              from: 'Hashtags',
              localField: 'hashtags',
              foreignField: '_id',
              as: 'hashtags'
            }
          },
          {
            $addFields: {
              hashtags: {
                $map: {
                  input: '$hashtags',
                  as: 'hashtag',
                  in: '$$hashtag.name'
                }
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'mentions',
              foreignField: '_id',
              as: 'mentions'
            }
          },
          {
            $addFields: {
              mentions: {
                $map: {
                  input: '$mentions',
                  as: 'mention',
                  in: {
                    name: '$$mention.name',
                    username: '$$mention.username',
                    avatar: '$$mention.avatar'
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: 'like',
              localField: 'tweet_ids',
              foreignField: 'tweet_id',
              as: 'likes'
            }
          },
          {
            $addFields: {
              like_count: {
                $size: '$likes'
              }
            }
          },
          {
            $lookup: {
              from: 'bookmark',
              localField: '_id',
              foreignField: '_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'comment',
              localField: 'tweet_ids',
              foreignField: 'tweet_id',
              as: 'comments'
            }
          },
          {
            $addFields: {
              comment_count: {
                $size: '$comments'
              }
            }
          },
          {
            $project: {
              _id: 1,
              content: 1,
              user_id: 1,
              mentions: 1,
              medias: 1,
              audience: 1,
              user_views: 1,
              guest_views: 1,
              updated_at: 1,
              created_at: 1,
              hashtags: 1,
              likes: 1,
              like_count: 1,
              comment_count: 1,
              bookmarks: 1,
              users: {
                username: '$user.username',
                avatar: '$user.avatar',
                name: '$user.name',
                bio: '$user.bio'
              }
            }
          },
          {
            $sort: {
              created_at: -1
            }
          },
          {
            $skip: Number(limit) * (Number(page) - 1)
          },
          {
            $limit: Number(limit)
          }
        ]
      ),
      bookmarkModel.countDocuments()
    ])

    return {
      message: 'get list bookmark successfully',
      data: listTweet,
      limit: Number(limit),
      total_pages: Math.ceil(total_records / Number(limit)),
      total_records: total_records,
      current_page: Number(limit) * (Number(page) - 1)
    }
  }
}
