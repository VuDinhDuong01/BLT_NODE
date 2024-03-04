/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { hashTagsModel } from '~/models/model/hashtags.model'
import { tweetModel } from '~/models/model/tweet.model'
import { userModel } from '~/models/model/user.model'
import { GenerateType } from '~/types/generate'
import { Tweet, TweetDetail } from '~/types/tweet.types'

export const TweetServices = {
  createTweet: async ({
    hashtags,
    content,
    audience,
    mentions,
    medias,
    user_id
  }: Omit<Tweet, 'created_at' | 'updated_at' | 'user_views' | 'guest_views'>) => {
    const arrayHashTag = await Promise.all(
      hashtags?.map(async (item) => {
        const result = await hashTagsModel.findOneAndUpdate(
          { name: item },
          { $setOnInsert: { name: item } },
          { new: true, upsert: true }
        )
        return result
      }) || []
    )

    const idHashtags = arrayHashTag.map((item) => item._id)

    const arrayMentions = await Promise.all(
      mentions?.map(async (mention) => {
        const result = await userModel.findOne({ name: mention })
        return result
      }) || []
    )
    const idUser = arrayMentions?.map((item: any) => item?._id)
    console.log(idUser)

    await tweetModel.create({
      hashtags: idHashtags,
      content,
      audience,
      mentions: idUser,
      medias,
      user_id: new mongoose.Types.ObjectId(user_id as unknown as string)
    })
    return {
      message: 'create tweet successfully',
      data: {}
    }
  },
  increaseViews: async ({ tweet_id, user_id }: { tweet_id: string; user_id: string }) => {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await tweetModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(tweet_id)
      },
      {
        $inc: inc
      },
      {
        returnDocument: 'after',
        projection: {
          user_views: 1,
          guest_views: 1
        }
      }
    )

    return result as {
      user_views: number
      guest_views: number
    }
  },
  getTweetDetail: async ({  tweet_id }: { tweet_id: string }) => {
    const tweetDetail = await tweetModel.aggregate<GenerateType<TweetDetail>>([
        {
          $match:{
            _id:  new mongoose.Types.ObjectId(tweet_id)
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
            localField: '_id',
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
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'comment',
            localField: '_id',
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
              bio:'$user.bio'
            }
          }
        },
      ])
    return tweetDetail
    
  
  },
  getListTweet: async ({ user_id, page, limit }: { user_id: string; page: string; limit: string }) => {
    const userId =   String( new mongoose.Types.ObjectId(user_id)) 
    const [listTweet, total_records] = await Promise.all([
      tweetModel.aggregate<GenerateType<TweetDetail[]>>([
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
            localField: '_id',
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
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'comment',
            localField: '_id',
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
              bio:'$user.bio'
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
      ]),
      tweetModel.countDocuments()
    ])
    return {
      message: 'get list tweet successfully',
      data: listTweet,
      limit: Number(limit),
      total_pages: Math.ceil(total_records / Number(limit)),
      total_records: total_records,
      current_page: Number(limit) * (Number(page) - 1)
    }
  }
}
