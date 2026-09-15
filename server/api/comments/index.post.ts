import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { comments } from '../../db/schema'
import { getTokenFromEvent, getUserFromToken } from '../../utils/auth'

const bodySchema = z.object({
  postId: z.number().int().positive(),
  parentId: z.number().int().positive().nullish(),
  content: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const token = getTokenFromEvent(event)
  const user = token ? await getUserFromToken(token) : null

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Login required to comment' })
  }

  const body = await readValidatedBody(event, bodySchema.parse)

  // Only admins can reply, and replies can only be one level deep.
  if (body.parentId) {
    if (user.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Only admins can reply' })
    }

    const parent = await db.query.comments.findFirst({
      where: eq(comments.id, body.parentId),
    })

    if (!parent) {
      throw createError({ statusCode: 404, statusMessage: 'Parent comment not found' })
    }

    if (parent.parentId) {
      throw createError({ statusCode: 400, statusMessage: 'Only one level of replies is allowed' })
    }
  }

  const [inserted] = await db
    .insert(comments)
    .values({
      postId: body.postId,
      parentId: body.parentId ?? null,
      userId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: body.content,
      isAuthor: user.role === 'admin',
    })
    .$returningId()

  if (!inserted?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create comment' })
  }

  return { id: inserted.id }
})
