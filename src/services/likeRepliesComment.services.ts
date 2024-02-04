import mongoose from 'mongoose'

import { repliesLikeCommentModel } from '~/models/model/likeRepliesComment.model'

interface CommentProps {
  user_id: string
  replies_comment_id: string
}

export const repliesLikeCommentServices = {
  create: async ({ user_id, replies_comment_id }: CommentProps) => {
    const checkExist = await repliesLikeCommentModel.findOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      replies_comment_id: new mongoose.Types.ObjectId(replies_comment_id)
    })
    if (checkExist) {
      await repliesLikeCommentModel.deleteOne({
        user_id: new mongoose.Types.ObjectId(user_id),
        replies_comment_id: new mongoose.Types.ObjectId(replies_comment_id)
      })
    } else {
      await repliesLikeCommentModel.create({
        replies_comment_id: new mongoose.Types.ObjectId(replies_comment_id),
        user_id: new mongoose.Types.ObjectId(user_id)
      })
    }
    return {
      message: 'create replies like comment successfully',
      data: {}
    }
  }
}
