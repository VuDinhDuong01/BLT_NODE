import { Router } from 'express'
import { sharePostController } from '~/controllers/share-post.controller'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/share_post', validateAccessToken, sharePostController.createSharePost)


export default route
