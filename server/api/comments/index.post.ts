import { z } from 'zod'
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
