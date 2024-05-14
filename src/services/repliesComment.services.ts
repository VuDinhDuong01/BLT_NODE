import mongoose from 'mongoose'

import { commentModel } from '~/models/model/comment.model'
import { repliesCommentModel } from '~/models/model/repliesComment.model'

interface CommentProps {
  user_id: string
  replies_comment_id: string
  replies_content_comment?: string
  replies_image_comment?: string
}

export const repliesCommentServices = {
  create: async ({ user_id, replies_comment_id, replies_content_comment, replies_image_comment }: CommentProps) => {
    await repliesCommentModel.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      replies_comment_id: new mongoose.Types.ObjectId(replies_comment_id),
      replies_content_comment,
      replies_image_comment,
      replies_like_comments: []
    })
    return {
      message: 'create replies comment successfully',
      data: {}
    }
  },
  update: async ({
    replies_comment_id,
    user_id,
    icon
  }: {
    replies_comment_id: string
    user_id: string
    icon: string
  }) => {
    const findRepliesComment = await repliesCommentModel.findOne({
      _id: new mongoose.Types.ObjectId(replies_comment_id)
    })
    const convertObjectIdToString = findRepliesComment?.replies_like_comments?.map((item) => {
      return {
        user_id: String(item.user_id)
      }
    })

    const checkRepliesComment = convertObjectIdToString?.some((item) => item.user_id === user_id)
    console.log(replies_comment_id)
    if (checkRepliesComment) {
      const res = await repliesCommentModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(replies_comment_id)
        },
        {
          $set: {
            replies_like_comments: { user_id: new mongoose.Types.ObjectId(user_id), icon: icon }
          }
        },
        {
          new: true
        }
      )
      return {
        message: 'success delete',
        data: res
      }
    } else {
      const res = await repliesCommentModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(replies_comment_id)
        },
        {
          $push: {

            replies_like_comments: {
              user_id: new mongoose.Types.ObjectId(user_id),
              icon: icon
            }
          }
        },
        {
          new: true
        }
      )
      return {
        message: 'success create',
        data: res
      }
    }
  },

  delete: async ({ user_id, _id }: { user_id: string; _id: string }) => {
    await repliesCommentModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      _id: new mongoose.Types.ObjectId(_id)
    })
    return {
      message: 'delete replies comment successfully',
      data: {}
    }
  },
  edit: async ({
    user_id,
    _id,
    replies_content_comment,
    replies_image_comment
  }: {
    user_id: string
    _id: string
    replies_content_comment: string
    replies_image_comment: string
  }) => {
    const res = await repliesCommentModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        _id: new mongoose.Types.ObjectId(_id)
      },
      {
        $set: {
          replies_content_comment,
          replies_image_comment
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

  getList: async ({ user_id }: { user_id: string }) => {
    const result = await commentModel.find({ user_id: new mongoose.Types.ObjectId(user_id) })
    return {
      message: 'get list bookmark successfully',
      data: result
    }
  }
}
