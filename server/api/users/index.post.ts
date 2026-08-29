import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../../utils/db'
import { users } from '../../db/schema'

const bodySchema = z.object({
  name: z.string().min(1),
  nickname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
  role: z.enum(['admin', 'author']).default('author'),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const [inserted] = await db
    .insert(users)
    .values({
      name: body.name,
      nickname: body.nickname,
      email: body.email,
      password: hashedPassword,
      avatar: body.avatar,
      role: body.role,
    })
    .$returningId()

  if (!inserted?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
  }

  return { id: inserted.id }
})
