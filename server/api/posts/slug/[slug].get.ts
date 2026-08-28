import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { posts } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      author: true,
      postTags: {
        with: {
          tag: true,
        },
      },
    },
  })

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  return post
})
