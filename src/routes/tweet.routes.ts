import { Router } from 'express'
import { TweetController } from '~/controllers/tweet.controller'
import { validationTweet } from '~/middlewares/tweet.middlewares'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/create_tweet', validateAccessToken, validationTweet, TweetController.createTweet)

export default route
