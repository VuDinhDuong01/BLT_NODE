import mongoose from "mongoose";

import tweetSchema, { Tweets } from "../schemas/tweet.schema";


export const tweetModel = mongoose.model<Tweets>('tweet', tweetSchema);