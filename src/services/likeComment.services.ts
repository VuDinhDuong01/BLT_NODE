import mongoose from 'mongoose'

import { likeCommentModel } from '~/models/model/like_comment'

interface CommentProps {
  user_id: string
  comment_id: string
}

export const likeCommentServices = {
  create: async ({ user_id, comment_id }: CommentProps) => {
    const checkExist = await likeCommentModel.findOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      comment_id: new mongoose.Types.ObjectId(comment_id)
    })
    if (checkExist) {
      await likeCommentModel.deleteOne({
        user_id: new mongoose.Types.ObjectId(user_id),
        comment_id: new mongoose.Types.ObjectId(comment_id)
      })
    } else {
      await likeCommentModel.create({
        comment_id: new mongoose.Types.ObjectId(comment_id),
        user_id: new mongoose.Types.ObjectId(user_id)
      })
    }
    return {
      message: 'create  like comment successfully',
      data: {}
    }
  }
}
