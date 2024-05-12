import mongoose from 'mongoose'
import { Response } from 'express'

import { userModel } from '~/models/model/user.model'
import { userType } from '~/types/users.types'
import { hashPassword } from '~/utils/hash-password'
import { signJWT } from '~/utils/jwt'
import { configEnv } from '~/constants/configENV'
import { sendMail } from '~/utils/send-mail'
import { refreshTokenModel } from '~/models/model/refresh-token'
import { randomToken } from '~/utils/random-token'
// import { EmailVerifyToken } from '~/type'
import { GenerateType } from '~/types/generate'
import { TweetDetail } from '~/types/tweet.types'
import { sendEMail } from '~/utils/mail'


export const userServices = {
  access_token: async ({ user_id, time }: { user_id: string; time: string | number }) =>
    await signJWT({
      payload: { user_id: user_id },
      privateKey: configEnv.PRIMARY_KEY,
      options: { expiresIn: time }
    }),
  refresh_token: async ({ user_id, exp }: { user_id: string; exp?: number }) => {
    if (exp) {
      return await signJWT({ payload: { user_id: user_id, exp }, privateKey: configEnv.PRIMARY_KEY_REFRESH_TOKEN })
    }
    return await signJWT({
      payload: { user_id: user_id },
      privateKey: configEnv.PRIMARY_KEY_REFRESH_TOKEN,
      options: { expiresIn: '10h' }
    })
  },

  register: async ({
    payload,
   
  }: {
    payload: Pick<userType, 'name' | 'password' | 'email'>
  }) => {
    const _id = new mongoose.Types.ObjectId()
    const codeRandom = randomToken()
    await sendEMail({ subject: 'Mã xác thực của bạn tại đây', object: codeRandom , to:payload.email })
    const dataResponse = {
      ...payload,
      _id: _id,
      email_verify_token: codeRandom,
      password: hashPassword(payload.password)
    }
    await userModel.create(dataResponse)
    return {
      message: 'register successfully',
      data: {
        _id
      }
    }
  },

  checkEmailExist: async (email: string) => {
    const checkExist = await userModel.findOne({ email })
    return checkExist
  },

  EmailVerifyToken: async (profile: userType) => {
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: profile?._id!.toString(), time: '1h' }),
      userServices.refresh_token({ user_id: profile?._id!.toString() })
    ])
    await Promise.all([
      refreshTokenModel.create({ refresh_token }),
      userModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(profile._id)
        },
        {
          $set: {
            verify: 1,
            email_verify_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        },
        {
          new: true
        }
      )
    ])
    return {
      data: {
        access_token,
        refresh_token
      },
      message: 'verify_email_token successfully'
    }
  },
  login: async (email: string) => {
    const res = (await userModel
      .findOne({ email })
      .select('-password -verify -email_verify_token -forgot_password_token')) as userType
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: res._id as string, time: '1h' }),
      userServices.refresh_token({ user_id: res._id as string })
    ])
    await refreshTokenModel.create({ user_id: res._id, refresh_token })
    return {
      message: 'login successfully',
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
        user: res
      }
    }
  },
  refreshToken: async ({ user_id, exp, token }: { user_id: string; exp: number; token: string }) => {
    const [access_token, refresh_token] = await Promise.all([
      userServices.access_token({ user_id: user_id, time: '1h' }),
      userServices.refresh_token({ user_id: user_id, exp: exp }),
      await refreshTokenModel.deleteOne({ refresh_token: token })
    ])
    await refreshTokenModel.create({ user_id: user_id, refresh_token: refresh_token })
    return {
      message: 'refresh_token successfully',
      data: {
        access_token,
        refresh_token
      }
    }
  },
  logout: async ({ user_id }: { user_id: string }) => {
    await refreshTokenModel.deleteMany({ user_id })
    return {
      message: 'logout successfully',
      data: {}
    }
  },
  forgotPassword: async ({ _id, email}: { _id: string ,email:string }) => {
    const token = randomToken()
    const [res] = await Promise.all([
      userModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(_id) },
          {
            $set: {
              forgot_password_token: token
            }
          },
          {
            new: true
          }
        )
        .select('_id'),
      // sendMail({ subject: 'Mã xác thực của bạn tại đây', object: token })
      await sendEMail({ subject: 'Mã xác thực của bạn tại đây', object: token , to:email })
    ])
    return {
      message: 'check email để xác nhận',
      data: res
    }
  },

  verifyForgotPassword: async ({ _id }: { _id: string }) => {
    const res = await userModel
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
          $set: {
            forgot_password_token: ''
          }
        },
        {
          new: true
        }
      )
      .select('_id')
    return {
      message: 'forgotPassword_verify_token successfully',
      data: res
    }
  },
  resetPassword: async ({ user_id, password }: { user_id: string; password: string }) => {
    const res = await userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password)
        }
      },
      {
        new: true
      }
    )
    return {
      message: 'reset password successfully',
      data: {}
    }
  },
  getMe: async (user_id: string) => {
    const result = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'tweet',
          localField: '_id',
          foreignField: 'user_id',
          as: 'tweets'
        }
      },
      {
        $lookup: {
          from: 'follow',
          localField: '_id',
          foreignField: 'following_id',
          as: 'follower'
        }
      },
      {
        $lookup: {
          from: 'follow',
          localField: '_id',
          foreignField: 'follower_id',
          as: 'following'
        }
      },
      {
        $addFields: {
          count_tweet: {
            $size: '$tweets'
          },
          count_following: {
            $size: '$following'
          },
          count_follower: {
            $size: '$follower'
          }
        }
      },
      {
        $project: {
          tweets: 0,
          follower: 0,
          following: 0,
          password: 0,
          forgot_password_token: 0
        }
      }
    ])
    return {
      message: 'get me successfully',
      data: result
    }
  },
  updateMe: async ({ user_id, payload }: { user_id: string; payload: userType }) => {
    const response = await userModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(user_id)
        },
        {
          $set: payload
        },
        {
          new: true
        }
      )
      .select('-email_verify_token -forgot_password_token  -password')
    return {
      message: 'update me successfully',
      data: response
    }
  },
  changePassword: async ({ user_id, payload }: { user_id: string; payload: userType }) => {
    const res = await userModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(user_id)
        },
        {
          $set: {
            password: hashPassword(payload.new_password as string)
          }
        },
        {
          new: true
        }
      )
      .select(' -forgot_password_token  -password')
    return {
      message: 'changePassword successfully',
      data: res
    }
  },
  getTweetUser: async ({
    user_id,
    title,
    limit,
    page
  }: {
    user_id: string
    title?: string
    limit: string
    page: string
  }) => {
    if (title === 'Posts') {
      const [listTweet, total_records] = await Promise.all([
        userModel.aggregate<GenerateType<TweetDetail[]>>([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'tweet',
              localField: '_id',
              foreignField: 'user_id',
              as: 'tweet'
            }
          },
          {
            $project: {
              _id: 0,
              tweet: 1
            }
          },
          {
            $unwind: {
              path: '$tweet'
            }
          },
          {
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
              created_at: '$tweet.created_at',
              check_share: '$tweet.check_share',
              postId: '$tweet.postId',
              username_share: '$tweet.username_share',
              avatar_share: '$tweet.avatar_share',
              content_share: '$tweet.content_share',
              medias_share: '$tweet.medias_share'
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
                name: '$user.name'
              },
              check_share: 1,
              postId: 1,
              username_share: 1,
              avatar_share: 1,
              content_share: 1,
              medias_share: 1
            }
          },
          {
            $skip: Number(limit) * (Number(page) - 1)
          },
          {
            $limit: Number(limit)
          }
        ]),
        userModel.aggregate<GenerateType<TweetDetail[]>>([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'tweet',
              localField: '_id',
              foreignField: 'user_id',
              as: 'tweet'
            }
          },
          {
            $project: {
              _id: 0,
              tweet: 1
            }
          },
          {
            $unwind: {
              path: '$tweet'
            }
          }
        ])
      ])
      return {
        message: 'get list tweet user successfully',
        data: listTweet,
        limit: Number(limit),
        total_pages: Math.ceil(total_records.length / Number(limit)),
        total_records: total_records.length,
        current_page: Number(limit) * (Number(page) - 1)
      }
    } else if (title === 'Like') {
      const [listTweet, total_records] = await Promise.all([
        userModel.aggregate<GenerateType<TweetDetail[]>>([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'like',
              localField: '_id',
              foreignField: 'user_id',
              as: 'likes'
            }
          },
          {
            $unwind: {
              path: '$likes',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 0,
              user_id: '$likes.user_id',
              tweet_id: '$likes.tweet_id'
            }
          },
          {
            $lookup: {
              from: 'tweet',
              localField: 'tweet_id',
              foreignField: '_id',
              as: 'tweet'
            }
          },
          {
            $project: {
              _id: 0,
              tweet: 1
            }
          },
          {
            $unwind: {
              path: '$tweet'
            }
          },
          {
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
              created_at: '$tweet.created_at',
              check_share: '$tweet.check_share',
              postId: '$tweet.postId',
              username_share: '$tweet.username_share',
              avatar_share: '$tweet.avatar_share',
              content_share: '$tweet.content_share',
              medias_share: '$tweet.medias_share'
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
                name: '$user.name'
              },
              check_share: 1,
              postId: 1,
              username_share: 1,
              avatar_share: 1,
              content_share: 1,
              medias_share: 1
            }
          },
          {
            $skip: Number(limit) * (Number(page) - 1)
          },
          {
            $limit: Number(limit)
          }
        ]),
        userModel.aggregate<GenerateType<TweetDetail[]>>([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'like',
              localField: '_id',
              foreignField: 'user_id',
              as: 'likes'
            }
          },
          {
            $unwind: {
              path: '$likes',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 0,
              user_id: '$likes.user_id',
              tweet_id: '$likes.tweet_id'
            }
          },
          {
            $lookup: {
              from: 'tweet',
              localField: 'tweet_id',
              foreignField: '_id',
              as: 'tweet'
            }
          },
          {
            $project: {
              _id: 0,
              tweet: 1
            }
          },
          {
            $unwind: {
              path: '$tweet'
            }
          }
        ])
      ])

      return {
        message: 'get list tweet user successfully',
        data: listTweet,
        limit: Number(limit),
        total_pages: Math.ceil(total_records.length / Number(limit)),
        total_records: total_records.length,
        current_page: Number(limit) * (Number(page) - 1)
      }
    } else {
      const [listTweet, total_records] = await Promise.all([
        userModel.aggregate<GenerateType<TweetDetail[]>>([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'comment',
              localField: '_id',
              foreignField: 'user_id',
              as: 'comments'
            }
          },
          {
            $unwind: {
              path: '$comments',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 0,
              user_id: '$comments.user_id',
              tweet_id: '$comments.tweet_id'
            }
          },
          {
            $group: {
              _id: '$tweet_id',
              doc: {
                $first: '$$ROOT'
              }
            }
          },
          {
            $project: {
              _id: 0,
              tweet_id: '$doc.tweet_id',
              user_id: '$doc.user_id'
            }
          },
          {
            $lookup: {
              from: 'tweet',
              localField: 'tweet_id',
              foreignField: '_id',
              as: 'tweet'
            }
          },
          {
            $project: {
              _id: 0,
              tweet: 1
            }
          },
          {
            $unwind: {
              path: '$tweet'
            }
          },
          {
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
              created_at: '$tweet.created_at',
              check_share: '$tweet.check_share',
              postId: '$tweet.postId',
              username_share: '$tweet.username_share',
              avatar_share: '$tweet.avatar_share',
              content_share: '$tweet.content_share',
              medias_share: '$tweet.medias_share'
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
                name: '$user.name'
                // bio: '$user.bio',
                // location: '$user.location',
                // website: '$user.website',
                // cover_photo: '$user.cover_photo',
                // roles: '$user.roles'
              },
              check_share: 1,
              postId: 1,
              username_share: 1,
              avatar_share: 1,
              content_share: 1,
              medias_share: 1
            }
          },
          {
            $skip: Number(limit) * (Number(page) - 1)
          },
          {
            $limit: Number(limit)
          }
        ]),
        userModel.aggregate<GenerateType<TweetDetail[]>>([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'comment',
              localField: '_id',
              foreignField: 'user_id',
              as: 'comments'
            }
          },
          {
            $unwind: {
              path: '$comments',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 0,
              user_id: '$comments.user_id',
              tweet_id: '$comments.tweet_id'
            }
          },
          {
            $group: {
              _id: '$tweet_id',
              doc: {
                $first: '$$ROOT'
              }
            }
          },
          {
            $project: {
              _id: 0,
              tweet_id: '$doc.tweet_id',
              user_id: '$doc.user_id'
            }
          }
        ])
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
  },
  searchUser: async ({ user_search }: { user_search: string }) => {
    const res = await userModel.find({ name: { $regex: new RegExp(user_search, 'i') } })
    return {
      message: 'success',
      data: res
    }
  },

  getAllUser: async ({
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
    const response = await userModel.aggregate($match)
    const totalItem = await userModel.countDocuments(queryCount)

    return {
      message: 'get user successfully',
      data: response,
      total_page: Math.ceil(totalItem / Number(limit))
    }
  },

  deleteUser: async (user_id: string) => {
    await userModel.deleteOne({ _id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'delete user successfully'
    }
  },
  deleteManyUser: async (arrayIdPost: string[]) => {
    const ObjectId = arrayIdPost.map((item) => new mongoose.Types.ObjectId(item))
    await userModel.deleteMany({ _id: { $in: ObjectId } })
    return {
      message: 'delete  many user successfully'
    }
  }
}
