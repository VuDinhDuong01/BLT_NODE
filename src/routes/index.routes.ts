import { Application } from "express";

import userRoute from './user.routes'
import followRoute from './follower.routes'
const route=(app:Application)=>{
  app.use('/api/v1',userRoute)
  app.use('/api/v1',followRoute)
}

export default route