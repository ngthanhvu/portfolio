import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { projects } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid project ID' })
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  })

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  return project
})
