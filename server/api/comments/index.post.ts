import { z } from 'zod'
import { db } from '../../utils/db'
import { comments } from '../../db/schema'

const bodySchema = z.object({
  postId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(),
  userId: z.number().int().positive().optional(),
  authorName: z.string().min(1),
  authorAvatar: z.string().optional(),
  content: z.string().min(1),
  isAuthor: z.boolean().default(false),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const [inserted] = await db
    .insert(comments)
    .values({
      postId: body.postId,
      parentId: body.parentId,
      userId: body.userId,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar,
      content: body.content,
      isAuthor: body.isAuthor,
    })
    .$returningId()

  if (!inserted?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create comment' })
  }

  return { id: inserted.id }
})
