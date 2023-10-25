import Redis from "ioredis";

export const connectRedis = async () => {
  try {
    await new Redis("redis://:olW2Vysas5wituF79twhyIrz1Exx41cQ@redis-16655.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:16655");
    console.log("connect redis successfully")
  }
  catch (e) {
    console.log("connect reids failed")
  }

}