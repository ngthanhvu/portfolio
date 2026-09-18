import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { generateToken, checkRateLimit, getRateLimitKey } from '../../utils/auth'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const rateLimit = checkRateLimit(getRateLimitKey(event, 'login'), 5, 15 * 60 * 1000)
  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Please try again later.',
    })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  })

  if (!user || !user.password) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(body.password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const token = generateToken({ userId: user.id, role: user.role })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  }
})
