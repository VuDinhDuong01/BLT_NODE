import { Application } from 'express'

import userRoute from './user.routes'
import followRoute from './follower.routes'
import uploadFileRoute from './upload-file'
import tweetRoute from './tweet.routes'
const route = (app: Application) => {
  app.use('/api/v1', userRoute)
  app.use('/api/v1', followRoute)
  app.use('/api/v1', uploadFileRoute)
  app.use('/api/v1', tweetRoute)
}

export default route
