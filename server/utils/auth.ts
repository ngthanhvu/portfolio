import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from '../db/schema'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface JwtPayload {
  userId: number
  role: string
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  }
  catch {
    return null
  }
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.userId),
  })

  if (!user) return null

  return user
}

export function getTokenFromEvent(event: any): string | null {
  const cookie = getCookie(event, 'auth_token')
  if (cookie) return cookie

  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}
