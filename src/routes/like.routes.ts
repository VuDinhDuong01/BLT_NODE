import { Router } from 'express'
import { likeController } from '~/controllers/like.controller'
import { validationLike } from '~/middlewares/like.middlewares'


import { validateAccessToken } from '~/middlewares/user.middlewares'

const route = Router()

route.post('/like', validateAccessToken, validationLike, likeController.create)
route.delete('/unlike', validateAccessToken, validationLike, likeController.delete)
route.get('/get_like', validateAccessToken, likeController.get)


route.get('/all_like', likeController.getAllLike)
route.delete('/like', likeController.deleteLike)
route.delete('/many_like', likeController.deleteManyLike)

export default route
