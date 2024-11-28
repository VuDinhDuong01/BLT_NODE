import { Router } from 'express'
import { TweetController } from '~/controllers/tweet.controller'
import { validationTweet, validationTweetId } from '~/middlewares/tweet.middlewares'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/tweet', validateAccessToken,validationTweet, TweetController.createTweet)
route.get('/tweet/:tweet_id', validateAccessToken, TweetController.getTweetDetail)
route.get('/list_tweet', validateAccessToken, TweetController.getListTweet)

route.get('/all_tweet', TweetController.getAllTweet)
route.delete('/tweet', TweetController.deleteTweet)
route.delete('/many_tweet', TweetController.deleteManyTweet)

export default route
