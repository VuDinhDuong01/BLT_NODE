import mongoose from 'mongoose'

import { likeCommentModel } from '~/models/model/like_comment'

interface CommentProps {
  user_id: string
  comment_id: string
  icon: string
}

export const likeCommentServices = {
  create: async ({ user_id, comment_id, icon }: CommentProps) => {
    const checkExist = await likeCommentModel.findOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      comment_id: new mongoose.Types.ObjectId(comment_id)
    })
    if (checkExist) {
      if (icon !== checkExist.icon) {
        await likeCommentModel.updateOne(
          {
            user_id: new mongoose.Types.ObjectId(user_id),
            comment_id: new mongoose.Types.ObjectId(comment_id)
          },
          {
            icon: icon
          },
          {
            new: true
          }
        )
      } else {
        await likeCommentModel.deleteOne({
          user_id: new mongoose.Types.ObjectId(user_id),
          comment_id: new mongoose.Types.ObjectId(comment_id)
        })
      }
    } else {
      await likeCommentModel.create({
        comment_id: new mongoose.Types.ObjectId(comment_id),
        user_id: new mongoose.Types.ObjectId(user_id),
        icon: icon
      })
    }
    return {
      message: 'create  like comment successfully',
      data: {}
    }
  }
}
