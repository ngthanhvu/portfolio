import { posts, getPostBySlug as findPostBySlug } from '~/data/posts'
import type { BlogPost } from '~/types'

export function usePosts() {
  const allPosts = ref<BlogPost[]>(posts)

  const getPostBySlug = (slug: string): BlogPost | undefined => {
    return findPostBySlug(slug)
  }

  return {
    allPosts,
    getPostBySlug
  }
}
