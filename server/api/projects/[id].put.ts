import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../utils/db'
import { projects } from '../../db/schema'
import { requireAdmin } from '../../utils/auth'
import { sanitizeHtml } from '../../utils/sanitize'

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().optional().nullable(),
  url: z.string().min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid project ID' })
  }

  await requireAdmin(event)

  const body = await readValidatedBody(event, bodySchema.parse)

  await db
    .update(projects)
    .set({
      name: body.name,
      description: body.description !== undefined ? sanitizeHtml(body.description) : undefined,
      image: body.image,
      url: body.url,
    })
    .where(eq(projects.id, id))

  return { success: true }
})
