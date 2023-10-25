import { Router } from "express";
import { userControllers } from "~/controllers/user.controllers";

const route=Router()

route.post('/register',userControllers.register)

export default route