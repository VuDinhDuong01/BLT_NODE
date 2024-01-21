/* eslint-disable prettier/prettier */
import { hashTagsModel } from '~/models/model/hashtags.model'
import { tweetModel } from '~/models/model/tweet.model'
import { Tweet } from '~/types/tweet.types'

export const TweetServices = {
  createTweet: async ({
    type,
    hashtags,
    content,
    audience,
    mentions,
    medias,
    user_id
  }: Omit<Tweet, 'created_at' | 'updated_at' | 'user_views' | 'guest_views'>) => {
    const arrayHashTag = await Promise.all(
      hashtags?.map(async (item) => {
        const result = await hashTagsModel.findOneAndUpdate(
          { name: item },
          { $setOnInsert: { name: item } },
          { new: true, upsert: true }
        );
        return result 
      }) || []
    );

    console.log(arrayHashTag)

    await tweetModel.create({
      type,
      hashtags,
      content,
      audience,
      mentions,
      medias,
      user_id
    })
    return {
      message: 'create tweet successfully',
      data: {}
    }
  }
}
