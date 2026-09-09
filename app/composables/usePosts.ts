import type { BlogPost } from '~/types'

export interface ApiPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  authorId: number | null
  author: {
    id: number
    name: string
    nickname: string
    email: string
    avatar: string | null
    bio: string | null
    role: string
  } | null
  publishedAt: string
  readTime: string | null
  postTags: { tag: { name: string } }[]
}

function mapPost(post: ApiPost): BlogPost {
  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || '',
    category: post.category,
    author: post.author?.name || 'Unknown',
    authorAvatar: post.author?.avatar || '',
    publishedAt: new Date(post.publishedAt).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    readTime: post.readTime || '',
    tags: post.postTags?.map((pt) => pt.tag.name) || [],
  }
}

export function usePosts() {
  const { data: allPosts, pending: loading, error, refresh: fetchPosts } = useAsyncData(
    'posts',
    () => $fetch<{ data: ApiPost[] }>('/api/posts').then(r => r.data.map(mapPost)),
    { default: () => [] as BlogPost[] },
  )

  async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const post = await $fetch<ApiPost>(`/api/posts/slug/${slug}`)
    return post ? mapPost(post) : undefined
  }

  return {
    allPosts,
    loading,
    error,
    fetchPosts,
    getPostBySlug,
  }
}
