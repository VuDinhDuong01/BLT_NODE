import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'
import { CommentType } from '~/types/comment'
import { GenerateType } from '~/types/generate'
interface CommentProps {
  user_id: string
  tweet_id: string
  content_comment?: string
  image_comment?: string[]
}

export const commentServices = {
  create: async ({ user_id, tweet_id, content_comment, image_comment }: CommentProps) => {
    await commentModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      tweet_id: new mongoose.Types.ObjectId(tweet_id),
      content_comment,
      image_comment
    })
    return {
      message: 'create comment successfully',
      data: {}
    }
  },

  delete: async ({ user_id, _id }: { user_id: string; _id: string }) => {
    console.log({ user_id, _id })
    await commentModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      _id: new mongoose.Types.ObjectId(_id)
    })
    return {
      message: 'delete comment successfully',
      data: {}
    }
  },
  edit: async ({
    user_id,
    _id,
    content_comment,
    image_comment
  }: {
    user_id: string
    _id: string
    content_comment: string
    image_comment: string
  }) => {
    const res = await commentModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        _id: new mongoose.Types.ObjectId(_id)
      },
      {
        $set: {
          content_comment,
          image_comment
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        new: true
      }
    )
    return {
      message: 'update comment successfully',
      data: res
    }
  },
  getListCommentWithTweet: async ({ tweet_id, limit, page }: { tweet_id: string; limit: string; page: string }) => {
    const [listComment, total_records] = await Promise.all([
      commentModel.aggregate<GenerateType<CommentType[]>>([
        {
          $match: {
            tweet_id: new mongoose.Types.ObjectId(tweet_id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'info_user'
          }
        },
        {
          $addFields: {
            info_user: {
              $map: {
                input: '$info_user',
                as: 'info',
                in: {
                  avatar: '$$info.avatar',
                  username: '$$info.name'
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$info_user',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'replies_comment',
            localField: '_id',
            foreignField: 'replies_comment_id',
            as: 'replies_comments'
          }
        },
        {
          $lookup: {
            from: 'like_comment',
            localField: '_id',
            foreignField: 'comment_id',
            as: 'like_comments'
          }
        },
        {
          $unwind: {
            path: '$replies_comments',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'replies_comments.user_id',
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
          $group: {
            _id: '$_id',
            user_id: {
              $first: '$user_id'
            },
            tweet_id: {
              $first: '$tweet_id'
            },
            content_comment: {
              $first: '$content_comment'
            },
            image_comment: {
              $first: '$image_comment'
            },
            created_at: {
              $first: '$created_at'
            },
            updated_at: {
              $first: '$updated_at'
            },
            info_user: {
              $first: '$info_user'
            },
            like_comments: {
              $first: '$like_comments'
            },
            replies_comments: {
              $push: {
                _id: '$replies_comments._id',
                user_id: '$replies_comments.user_id',
                replies_comment_id: '$replies_comments.replies_comment_id',
                replies_content_comment: '$replies_comments.replies_content_comment',
                replies_image_comment: '$replies_comments.replies_image_comment',
                replies_like_comments: '$replies_comments.replies_like_comments',
                created_at: '$replies_comments.created_at',
                updated_at: '$replies_comments.updated_at',
                avatar: '$user.avatar',
                username: '$user.name'
              }
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
      commentModel.countDocuments({ tweet_id: new mongoose.Types.ObjectId(tweet_id) })
    ])
    return {
      message: 'get comment successfully',
      data: listComment,
      total_records,
      limit: Number(limit),
      current_page: Number(limit) * (Number(page) - 1),
      total_page: Math.ceil(total_records / Number(limit))
    }
  },
  getAllComment: async ({
    limit,
    page,
    content_comment,
    sort_by,
    order
  }: {
    limit: string
    page: string
    content_comment?: string | null
    sort_by?: string | null
    order?: string
  }) => {
    const $match: any[] = []

    if (content_comment) {
      $match.push({
        $match: {
          $text: {
            $search: content_comment
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
    if (sort_by === 'content_comment') {
      const sortOrder = order === 'asc' ? 1 : -1
      const sortObject: any = {}
      sortObject['content_comment'] = sortOrder
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
    if (content_comment) {
      queryCount['$text'] = { $search: content_comment }
    }
    const response = await commentModel.aggregate($match)
    const totalItem = await commentModel.countDocuments(queryCount)

    return {
      message: 'get comment successfully',
      data: response,
      total_page: Math.ceil(totalItem / Number(limit))
    }
  },

  deleteComment: async (user_id: string) => {
    await commentModel.deleteOne({ _id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'delete comment successfully'
    }
  },
  deleteManyComment: async (arrayIdPost: string[]) => {
    const ObjectId = arrayIdPost.map((item) => new mongoose.Types.ObjectId(item))
    await commentModel.deleteMany({ _id: { $in: ObjectId } })
    return {
      message: 'delete  many comment successfully'
    }
  },
}
