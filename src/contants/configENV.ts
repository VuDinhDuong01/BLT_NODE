import { config} from "dotenv";
const pathName=process.env.NODE_ENV
config({
  path:`.env.${pathName}`
})

export const configEnv={
  PORT:process.env.PORT as string ,
  PRIMARY_KEY:process.env.PRIMARY_KEY as string 
  
}