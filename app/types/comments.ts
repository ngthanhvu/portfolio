export interface CommentUser {
  id: string
  name: string
  avatar: string
  isAuthor?: boolean
}

export interface Comment {
  id: number
  postId: number
  parentId: number | null
  userId: number | null
  authorName: string
  authorAvatar: string | null
  content: string
  likes: number
  dislikes: number
  isAuthor: boolean
  status: string
  createdAt: string
}

export type CommentSort = 'best' | 'newest' | 'oldest'
