import { Application } from 'express'

import userRoute from './user.routes'
import followRoute from './follower.routes'
import uploadFileRoute from './upload-file'
import tweetRoute from './tweet.routes'
import bookmarkRoute from './bookmark.routes'
import likeRoute from './like.routes'
import commentRoute from './comment.routes'
import likeCommentRoute from './likeComment.routes'
import repliesLikeCommentRoute from './likeRepliesComment.routes'
import repliesCommentRoute from './repliesComment.routes'
const route = (app: Application) => {
  app.use('/api/v1', userRoute)
  app.use('/api/v1', followRoute)
  app.use('/api/v1', uploadFileRoute)
  app.use('/api/v1', tweetRoute)
  app.use('/api/v1', bookmarkRoute)
  app.use('/api/v1', likeRoute)
  app.use('/api/v1', commentRoute)
  app.use('/api/v1', likeCommentRoute)
  app.use('/api/v1', repliesLikeCommentRoute)
  app.use('/api/v1', repliesCommentRoute)
}

export default route
