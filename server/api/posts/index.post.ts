import { z } from 'zod'
import { db } from '../../utils/db'
import { posts, postTags } from '../../db/schema'

const bodySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  category: z.string().min(1),
  authorId: z.number().int().positive(),
  publishedAt: z.string().datetime().optional(),
  readTime: z.string().optional(),
  tagIds: z.array(z.number().int().positive()).default([]),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const [inserted] = await db
    .insert(posts)
    .values({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      category: body.category,
      authorId: body.authorId,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      readTime: body.readTime,
    })
    .$returningId()

  if (!inserted?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create post' })
  }

  if (body.tagIds.length > 0) {
    await db.insert(postTags).values(
      body.tagIds.map((tagId) => ({ postId: inserted.id, tagId }))
    )
  }

  return { id: inserted.id }
})
