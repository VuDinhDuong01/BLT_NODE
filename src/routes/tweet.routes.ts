import { Router } from 'express'
import { TweetController } from '~/controllers/tweet.controller'
import { validationTweet, validationTweetId } from '~/middlewares/tweet.middlewares'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/tweet', validateAccessToken, validationTweet, TweetController.createTweet)
route.get('/tweet/:tweet_id', validateAccessToken, TweetController.getTweetDetail)
route.get('/tweet', validateAccessToken, TweetController.getListTweet)

export default route
