/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'

import { followModel } from '~/models/model/follower.model'
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
    user_id,
    medias_share,
    username_share,
    content_share,
    check_share,
    avatar_share,
    postId
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
        const result = await userModel.findOne({ name: { $regex: mention, $options: 'i' } });
        return result
      }) || []
    )
    const idUser = arrayMentions?.map((item: any) => item?._id)

    const res = await tweetModel.create({
      hashtags: idHashtags,
      content,
      audience,
      mentions: idUser,
      medias,
      user_id: new mongoose.Types.ObjectId(user_id as unknown as string),
      medias_share,
      username_share,
      content_share,
      check_share,
      avatar_share,
      postId
    })

    return {
      message: 'create tweet successfully',
      data: idUser.length > 0 ? {
        tweet_id: res._id,
        user_ids: idUser
      } : {}
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
  getTweetDetail: async ({ tweet_id }: { tweet_id: string }) => {
    const tweetDetail = await tweetModel.aggregate<GenerateType<TweetDetail>>([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(tweet_id)
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
            bio: '$user.bio'
          }
        }
      },
    ])
    return tweetDetail


  },
  getListTweet: async ({ id_user, page, limit, title_tweet }: { id_user?: string, page: string; limit: string, title_tweet?: string }) => {
    if (title_tweet === 'for_you') {
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
              from: "share_post",
              localField: "_id",
              foreignField: "postId",
              as: "share_post"
            },
          },
          {
            $addFields: {
              count_share_post: {
                $size: "$share_post"
              }
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
                bio: '$user.bio'
              },
              count_share_post: 1,
              check_share: 1,
              medias_share: 1,
              username_share: 1,
              content_share: 1,
              avatar_share: 1,
              postId:1
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
    } else {
      if (id_user !== '') {
        const [listTweet, total_records] = await Promise.all([
          followModel.aggregate<GenerateType<TweetDetail[]>>([
            {
              $match: {

                follower_id: new mongoose.Types.ObjectId(id_user)
              }
            }, {
              $lookup: {
                from: 'tweet',
                localField: 'following_id',
                foreignField: 'user_id',
                as: 'tweet'
              }
            }, {
              $unwind: {
                path: '$tweet'
              }
            }, {
              $project: {
                _id: 0,
                tweet: 1
              }
            }, {
              $project: {
                _id: '$tweet._id',
                content: '$tweet.content',
                user_id: '$tweet.user_id',
                hashtags: '$tweet.hashtags',
                mentions: '$tweet.mentions',
                medias: '$tweet.medias',
                audience: '$tweet.audience',
                user_views: '$tweet.user_views',
                guest_views: '$tweet.guest_views',
                updated_at: '$tweet.updated_at',
                created_at: '$tweet.created_at'
              }
            }
            ,
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
                from: "share_post",
                localField: "_id",
                foreignField: "postId",
                as: "share_post"
              },
            },
            {
              $addFields: {
                count_share_post: {
                  $size: "$share_post"
                }
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
                  bio: '$user.bio'
                },
                count_share_post: 1,
                check_share: 1,
                medias_share: 1,
                username_share: 1,
                content_share: 1,
                avatar_share: 1,
                postId:1
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
          followModel.aggregate<GenerateType<TweetDetail[]>>([
            {
              $match: {
                follower_id: new mongoose.Types.ObjectId(id_user)
              }
            }, {
              $lookup: {
                from: 'tweet',
                localField: 'following_id',
                foreignField: 'user_id',
                as: 'tweet'
              }
            }, {
              $unwind: {
                path: '$tweet'
              }
            }, {
              $project: {
                _id: 0,
                tweet: 1
              }
            }, {
              $project: {
                _id: '$tweet._id',
                content: '$tweet.content',
                user_id: '$tweet.user_id',
                hashtags: '$tweet.hashtags',
                mentions: '$tweet.mentions',
                medias: '$tweet.medias',
                audience: '$tweet.audience',
                user_views: '$tweet.user_views',
                guest_views: '$tweet.guest_views',
                updated_at: '$tweet.updated_at',
                created_at: '$tweet.created_at'
              }
            }
          ]),
        ])
        return {
          message: 'get list tweet user successfully',
          data: listTweet,
          limit: Number(limit),
          total_pages: Math.ceil(total_records.length / Number(limit)),
          total_records: total_records.length,
          current_page: Number(limit) * (Number(page) - 1)
        }
      }


    }

  },

  getAllTweet: async ({
    limit,
    page,
    content,
    sort_by,
    order
  }: {
    limit: string
    page: string
    content?: string | null
    sort_by?: string | null
    order?: string
  }) => {
    const $match: any[] = []

    if (content) {
      $match.push({
        $match: {
          $text: {
            $search: content
          }
        }
      })
    }
    $match.push({
      $sort: { created_at: -1 }
    })
    if (sort_by === 'content') {
      const sortOrder = order === 'asc' ? 1 : -1
      const sortObject: any = {}
      sortObject['content'] = sortOrder
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
    if (content) {
      queryCount['$text'] = { $search: content }
    }
    const response = await tweetModel.aggregate($match)
    const totalItem = await tweetModel.countDocuments(queryCount)

    return {
      message: 'get tweet successfully',
      data: response,
      total_page: Math.ceil(totalItem / Number(limit))
    }
  },

  deleteTweet: async (user_id: string) => {
    await tweetModel.deleteOne({ _id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'delete tweet successfully'
    }
  },
  deleteManyTweet: async (arrayIdPost: string[]) => {
    const ObjectId = arrayIdPost.map((item) => new mongoose.Types.ObjectId(item))
    await tweetModel.deleteMany({ _id: { $in: ObjectId } })
    return {
      message: 'delete  many tweet successfully'
    }
  },
}
