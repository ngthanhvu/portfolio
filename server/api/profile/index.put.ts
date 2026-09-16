import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../utils/db'
import { profiles, socialLinks, users, comments } from '../../db/schema'
import { getTokenFromEvent, getUserFromToken } from '../../utils/auth'

const bodySchema = z.object({
  name: z.string().min(1),
  nickname: z.string().min(1),
  tagline: z.string().max(255).optional().nullable(),
  bio: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  startDate: z.string().max(50).optional().nullable(),
  socials: z.array(z.object({
    name: z.string().min(1),
    url: z.string().url(),
    icon: z.string().min(1),
  })),
})

export default defineEventHandler(async (event) => {
  const token = getTokenFromEvent(event)
  const user = token ? await getUserFromToken(token) : null

  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = await readValidatedBody(event, bodySchema.parse)

  const existing = await db.query.profiles.findFirst()

  if (existing) {
    await db
      .update(profiles)
      .set({
        name: body.name,
        nickname: body.nickname,
        tagline: body.tagline,
        bio: body.bio,
        avatar: body.avatar,
        email: body.email,
        startDate: body.startDate,
      })
      .where(eq(profiles.id, existing.id))
  }
  else {
    await db.insert(profiles).values({
      name: body.name,
      nickname: body.nickname,
      tagline: body.tagline,
      bio: body.bio,
      avatar: body.avatar,
      email: body.email,
      startDate: body.startDate,
    })
  }

  await db.delete(socialLinks)

  if (body.socials.length > 0) {
    await db.insert(socialLinks).values(
      body.socials.map((link, index) => ({
        name: link.name,
        url: link.url,
        icon: link.icon,
        displayOrder: index,
      })),
    )
  }

  // Sync current admin's user record so future comments use the new name/avatar.
  await db
    .update(users)
    .set({
      name: body.name,
      avatar: body.avatar,
    })
    .where(eq(users.id, user.id))

  // Update all existing comments authored by this user to reflect the new avatar/name.
  await db
    .update(comments)
    .set({
      authorName: body.name,
      authorAvatar: body.avatar,
    })
    .where(eq(comments.userId, user.id))

  return { success: true }
})
