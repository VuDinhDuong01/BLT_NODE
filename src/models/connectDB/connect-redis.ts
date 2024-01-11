import Redis from "ioredis";

import { configEnv } from "~/contants/configENV";

export const connectRedis = async () => {
  try {
    await new Redis(configEnv.URL_REDIS);
    console.log("connect redis successfully")
  }
  catch (e) {
    console.log("connect reids failed")
  }
}