/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'

import { sharePostModel } from '~/models/model/share-post'


export const sharePostServices = {
  createSharePost: async ({
    postId
  }: { postId: string }) => {
    await sharePostModel.create({
      postId: new mongoose.Types.ObjectId(postId),
    })
    return {
      message: 'create share post successfully',
      data: {}
    }
  },
}
