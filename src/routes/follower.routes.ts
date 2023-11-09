import { Router } from "express";
import { followrController } from "~/controllers/follower.controller";

import { validateAccessToken } from "~/middlewares/user.middlewares";

const route = Router()

route.post('/follow/:id', validateAccessToken, followrController.follow)
route.post('/unfollow/:id', validateAccessToken, followrController.unFollow)

export default route