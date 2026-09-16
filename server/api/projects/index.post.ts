import { z } from 'zod'
import { db } from '../../utils/db'
import { projects } from '../../db/schema'
import { requireAdmin } from '../../utils/auth'
import { sanitizeHtml } from '../../utils/sanitize'

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  url: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readValidatedBody(event, bodySchema.parse)

  const [inserted] = await db
    .insert(projects)
    .values({
      name: body.name,
      description: sanitizeHtml(body.description),
      image: body.image,
      url: body.url,
    })
    .$returningId()

  if (!inserted?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create project' })
  }

  return { id: inserted.id }
})
