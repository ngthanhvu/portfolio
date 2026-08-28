import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { posts } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post ID' })
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
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
