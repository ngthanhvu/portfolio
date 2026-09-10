import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { generateToken } from '../../utils/auth'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  'cf-turnstile-response': z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  if (body['cf-turnstile-response']) {
    const result = await verifyTurnstileToken(body['cf-turnstile-response'])
    if (!result.success) {
      throw createError({ statusCode: 400, statusMessage: 'Captcha verification failed' })
    }
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
