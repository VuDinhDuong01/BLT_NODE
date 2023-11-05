import { Router } from "express";
import { userControllers } from "~/controllers/user.controllers";
import { validateAccessToken, validateDataUser, validationEmailVerifyToken, validationForgotPassword, validationForgotToken, validationLogin, validationRefreshToken, validationRegister, validationResetPassword } from "~/middlewares/user.middlewares";

const route = Router()

route.post('/register', validationRegister, userControllers.register)
route.post('/email_verify_token/:token', validationEmailVerifyToken, userControllers.EmailVerifyToken)
route.post('/login', validationLogin, userControllers.login)
route.post('/refresh_token', validationRefreshToken, userControllers.refresh_token)
route.post('/forgot_password', validationForgotPassword, userControllers.forgotPassword)
route.post('/forgot_password/:forgot_password_token', validationForgotToken, userControllers.verifyForgotPassword)
route.post('/reset_password/:user_id', validationResetPassword, userControllers.resetPassword)
route.get('/me', validateAccessToken, userControllers.getMe)
route.patch('/update_me', validateAccessToken, validateDataUser, userControllers.updateMe)

export default route