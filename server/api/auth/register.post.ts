import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { generateToken, checkRateLimit, getRateLimitKey } from '../../utils/auth'

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const rateLimit = checkRateLimit(getRateLimitKey(event, 'register'), 3, 60 * 60 * 1000)
  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many registration attempts. Please try again later.',
    })
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, body.email) })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const password = await bcrypt.hash(body.password, 10)
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.email)}`

  const [inserted] = await db
    .insert(users)
    .values({
      name: body.name,
      nickname: body.email,
      email: body.email,
      password,
      avatar,
      role: 'author',
    })
    .$returningId()

  if (!inserted?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create account' })
  }

  const token = generateToken({ userId: inserted.id, role: 'author' })
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return {
    id: inserted.id,
    name: body.name,
    email: body.email,
    role: 'author',
    avatar,
  }
})
