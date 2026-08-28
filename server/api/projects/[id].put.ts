import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../utils/db'
import { projects } from '../../db/schema'

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

  const body = await readValidatedBody(event, bodySchema.parse)

  await db
    .update(projects)
    .set({
      name: body.name,
      description: body.description,
      image: body.image,
      url: body.url,
    })
    .where(eq(projects.id, id))

  return { success: true }
})
