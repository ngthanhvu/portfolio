import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../utils/db'
import { profiles, socialLinks } from '../../db/schema'

const bodySchema = z.object({
  name: z.string().min(1),
  nickname: z.string().min(1),
  tagline: z.string(),
  bio: z.string(),
  avatar: z.string(),
  email: z.string(),
  startDate: z.string(),
  socials: z.array(z.object({
    name: z.string().min(1),
    url: z.string().min(1),
    icon: z.string().min(1),
  })),
})

export default defineEventHandler(async (event) => {
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

  return { success: true }
})
