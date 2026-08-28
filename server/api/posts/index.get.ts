import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { posts } from '../../db/schema'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Math.min(Number(query.limit) || 10, 50)
    const offset = (page - 1) * limit

    const list = await db.query.posts.findMany({
      with: {
        author: true,
        postTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: (posts, { desc }) => [desc(posts.publishedAt)],
      limit,
      offset,
    })

    const total = await db.$count(posts)

    return {
      data: list,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  catch (error: any) {
    console.error('GET /api/posts error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts',
      message: error?.message || 'Unknown error',
    })
  }
})
