import mongoose from "mongoose";

import tweetSchema from "../schemas/tweet.schema";
import { Tweet } from "~/types/tweet.types";

export const tweetModel = mongoose.model<Tweet>('tweet', tweetSchema);