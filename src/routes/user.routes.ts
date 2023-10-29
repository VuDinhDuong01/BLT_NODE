import { Router } from "express";
import { userControllers } from "~/controllers/user.controllers";
import { validationEmailVerifyToken, validationLogin, validationRegister } from "~/middlewares/user.middlewares";

const route = Router()

route.post('/register', validationRegister, userControllers.register)
route.post('/email_verify_token/:token', validationEmailVerifyToken, userControllers.EmailVerifyToken)
route.post('/login', validationLogin, userControllers.login)

export default route