import { Router } from 'express'
import { bookmarkController } from '~/controllers/bookmark.controller'
import { validationBookmark } from '~/middlewares/bookmark.middlewares'

import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/bookmark', validateAccessToken, validationBookmark, bookmarkController.create)
route.delete('/delete_bookmark', validateAccessToken, validationBookmark, bookmarkController.delete)
route.get('/bookmark/:user_id', validateAccessToken, bookmarkController.get)

export default route
