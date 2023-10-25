import { Application } from "express";

import userRoute from './user.routes'

const route=(app:Application)=>{
  app.use('/api/v1',userRoute)
}

export default route