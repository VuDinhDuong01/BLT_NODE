import { Request, Response, NextFunction } from "express"
import { userServices } from "~/services/user.services"
export const userControllers = {

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await userServices.register(req.body)
      return res.json(response)
    } catch (error) {
      console.log(error)
    }
  }
}