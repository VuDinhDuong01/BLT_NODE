import { Router } from "express";
import { userControllers } from "~/controllers/user.controllers";
import { validationRegister } from "~/middlewares/user.middlewares";

const route = Router()

route.post('/register', validationRegister, userControllers.register)

export default route