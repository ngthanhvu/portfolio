import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { projects } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid project ID' })
  }

  await db.delete(projects).where(eq(projects.id, id))

  return { success: true }
})
