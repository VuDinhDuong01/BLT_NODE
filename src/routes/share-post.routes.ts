import { Router } from 'express'
import { sharePostController } from '~/controllers/share-post.controller'
import { TweetController } from '~/controllers/tweet.controller'
import { validationTweet, validationTweetId } from '~/middlewares/tweet.middlewares'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/share-post', validateAccessToken, sharePostController.createSharePost)
route.get('/share-post/:tweet_id', validateAccessToken, TweetController.getTweetDetail)
route.get('/share-post', validateAccessToken, sharePostController.getSharePost)

export default route
