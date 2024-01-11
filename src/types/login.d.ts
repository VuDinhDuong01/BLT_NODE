import {type GenerateType} from './generate'
interface AuthResponse{
    _id?:string ,
    access_token:string ,
    refresh_token:string 
    role:string 
}
export type AuthResponseType=GenerateType<AuthResponse>
export interface AuthRequestProp{
    password:string ,
    email:string ,
    username?:string 
    
}
export type HandleDiaLog = {
    openDiaLog:()=>void,
};


export interface ErrorHandle {
    status:number,
    data:{
      message: string,
      error: {
        [key: string]: string 
      }
    }
  }