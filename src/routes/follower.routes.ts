import { Router } from 'express'

import { followController } from '~/controllers/follower.controller'
import { validationFollow } from '~/middlewares/follow.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/follow', validateAccessToken, validationFollow, followController.follow)
route.get('/get_user', validateAccessToken, followController.getListUser)
route.get('/get_follow', validateAccessToken, followController.getListFollow)

export default route
