import { Router } from 'express'
import { TweetController } from '~/controllers/tweet.controller'
import { validationTweet, validationTweetId } from '~/middlewares/tweet.middlewares'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/tweet', validateAccessToken, validationTweet, TweetController.createTweet)
route.get('/tweet/:tweet_id', validateAccessToken, validationTweetId, TweetController.getTweetDetail)

export default route
