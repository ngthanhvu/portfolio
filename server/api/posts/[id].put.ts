import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../utils/db'
import { posts, postTags } from '../../db/schema'
import { requireAdmin } from '../../utils/auth'
import { sanitizeHtml } from '../../utils/sanitize'

const bodySchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  category: z.string().min(1).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  readTime: z.string().optional().nullable(),
  tagIds: z.array(z.number().int().positive()).optional(),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post ID' })
  }

  await requireAdmin(event)

  const body = await readValidatedBody(event, bodySchema.parse)

  await db
    .update(posts)
    .set({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content !== undefined ? sanitizeHtml(body.content) : undefined,
      coverImage: body.coverImage,
      category: body.category,
      publishedAt: body.publishedAt === null ? null : body.publishedAt ? new Date(body.publishedAt) : undefined,
      readTime: body.readTime,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))

  if (body.tagIds !== undefined) {
    await db.delete(postTags).where(eq(postTags.postId, id))

    if (body.tagIds.length > 0) {
      await db.insert(postTags).values(
        body.tagIds.map((tagId) => ({ postId: id, tagId }))
      )
    }
  }

  return { success: true }
})
