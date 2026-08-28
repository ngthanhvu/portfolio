export interface CommentUser {
  id: string
  name: string
  avatar: string
  isAuthor?: boolean
}

export interface Comment {
  id: string
  user: CommentUser
  content: string
  createdAt: string
  createdAtTimestamp: number
  likes: number
  dislikes: number
  replies: Comment[]
  replyingTo?: string
}

export type CommentSort = 'best' | 'newest' | 'oldest'
