export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: string
  authorAvatar: string
  publishedAt: string
  readTime: string
  tags: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  image: string
  url: string
  tags?: string[]
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface Profile {
  name: string
  nickname: string
  tagline: string
  bio: string
  avatar: string
  email: string
  startDate: string
  socials: SocialLink[]
}
