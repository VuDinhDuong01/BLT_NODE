import { Router } from 'express'

import { followController } from '~/controllers/follower.controller'
import { validationFollow } from '~/middlewares/follow.middlewares'
import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/follow/:id', validateAccessToken, validationFollow, followController.follow)
route.post('/unFollow/:id', validateAccessToken, validationFollow, followController.unFollow)

export default route
