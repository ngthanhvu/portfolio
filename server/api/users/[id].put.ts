import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../../utils/db'
import { users } from '../../db/schema'

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  nickname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().optional().nullable(),
  role: z.enum(['admin', 'author']).optional(),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  const body = await readValidatedBody(event, bodySchema.parse)

  const updateData: any = {
    name: body.name,
    nickname: body.nickname,
    email: body.email,
    avatar: body.avatar,
    role: body.role,
    updatedAt: new Date(),
  }

  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10)
  }

  await db.update(users).set(updateData).where(eq(users.id, id))

  return { success: true }
})
