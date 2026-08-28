import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { posts } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post ID' })
  }

  await db.delete(posts).where(eq(posts.id, id))

  return { success: true }
})
