interface InfoUser {
  avatar: string
  username: string
}

interface RepliesLikeComments {
  id: string
  _id: string
  icon: string
}

interface RepliesComments {
  _id: string
  user_id: string
  replies_comment_id: string
  replies_image_comment: string[]
  created_at: string
  updated_at: string
  replies_like_comments: RepliesLikeComments[]
}

interface LikeComments {
  _id: string
  comment_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface CommentType {
  _id: string
  user_id: string
  tweet_id: string
  content_comment: string
  image_comment: string[]
  created_at: string
  updated_at: string
  info_user: InfoUser
  replies_comments: RepliesComments[]
  like_comments: LikeComments[]
}
