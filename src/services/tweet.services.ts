/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import { hashTagsModel } from '~/models/model/hashtags.model'
import { tweetModel } from '~/models/model/tweet.model'
import { userModel } from '~/models/model/user.model';
import { Tweet } from '~/types/tweet.types'

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
        );
        return result
      })
      || []
    );

    const idHashtags = arrayHashTag.map(item => item._id)

    const arrayMentions = await Promise.all(
      mentions?.map(async (mention) => {
        const result = await userModel.findOne({ name: mention })
        return result

      }) || []
    )
    const idUser = arrayMentions?.map((item: any) => item?._id)

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
  getTweetDetail: async ({ user_id, tweet_id }: { user_id: string, tweet_id: string }) => {
    const [tweet] = await tweetModel.aggregate<Tweet>(
      [
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(tweet_id)
          }
        }, {
          '$lookup': {
            'from': 'Hashtags',
            'localField': 'hashtags',
            'foreignField': "_id",
            'as': 'hashtags'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'mentions',
            'foreignField': user_id,
            'as': 'mentions'
          }
        }, {
          '$addFields': {
            'mentions': {
              '$map': {
                'input': '$mentions',
                'as': 'mention',
                'in': {
                  'name': '$$mention.name',
                  'email': '$$mention.email'
                }
              }
            }
          }
        }, {
          '$lookup': {
            'from': 'bookmark',
            'localField': user_id,
            'foreignField': user_id,
            'as': 'bookmark'
          }
        }, {
          '$addFields': {
            'sizeBookmark': {
              '$size': '$bookmark'
            }
          }
        }, {
          '$lookup': {
            'from': 'like',
            'localField': '_id',
            'foreignField': tweet_id,
            'as': 'like'
          }
        }, {
          '$addFields': {
            'count_like': {
              '$size': '$like'
            }
          }
        }, {
          '$lookup': {
            'from': 'tweet',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'tweet_children'
          }
        }, {
          '$addFields': {
            'count_types': {
              '$size': {
                '$filter': {
                  'input': '$tweet_children',
                  'as': 'children',
                  'cond': {
                    '$eq': [
                      '$$children.type', 1
                    ]
                  }
                }
              }
            },
            'views': {
              '$add': [
                '$user_views', '$type'
              ]
            }
          }
        }, {
          '$project': {
            'tweet_children': 0
          }
        }
      ]
    )
    return {
      message: "get tweet detail successfully",
      data: tweet
    }
  },
  getListTweet: async () => {
    const response = await tweetModel.aggregate(
      [
        {
          '$lookup': {
            'from': 'like', 
            'localField': '_id', 
            'foreignField': 'tweet_id', 
            'as': 'likes'
          }
        }, {
          '$addFields': {
            'like_count': {
              '$size': '$likes'
            }
          }
        }, {
          '$unwind': {
            'path': '$likes', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'content': 1, 
            'user_id': 1, 
            'hashtags': 1, 
            'mentions': 1, 
            'medias': 1, 
            'audience': 1, 
            'user_views': 1, 
            'guest_views': 1, 
            'like_count': 1, 
            'likes': {
              'status': '$likes.status'
            }
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'user_id', 
            'foreignField': '_id', 
            'as': 'users'
          }
        }, {
          '$addFields': {
            'user': {
              '$map': {
                'input': '$users', 
                'as': 'user', 
                'in': {
                  'name': '$$user.name', 
                  'username': '$$user.username', 
                  'avatar': '$$user.avatar', 
                  'bio': '$$user.bio'
                }
              }
            }
          }
        }, {
          '$project': {
            'users': 0
          }
        }, {
          '$lookup': {
            'from': 'bookmark', 
            'localField': '_id', 
            'foreignField': 'tweet_id', 
            'as': 'bookmark'
          }
        }, {
          '$unwind': {
            'path': '$bookmark', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'content': 1, 
            'user_id': 1, 
            'hashtags': 1, 
            'mentions': 1, 
            'medias': 1, 
            'audience': 1, 
            'user_views': 1, 
            'guest_views': 1, 
            'likes': 1, 
            'like_count': 1, 
            'user': 1, 
            'bookmark': {
              'status': '$bookmark.status'
            }
          }
        }
      ]
    )
    return {
      message: 'get list tweet successfully',
      data: response
    }
  }
}


