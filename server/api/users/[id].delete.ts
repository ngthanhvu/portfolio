import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  await db.delete(users).where(eq(users.id, id))

  return { success: true }
})
