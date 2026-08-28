import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { comments } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment ID' })
  }

  await db.delete(comments).where(eq(comments.id, id))

  return { success: true }
})
