import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from '../db/schema'
import type { User } from '../db/schema'

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

export function sanitizeUser(user: User | null | undefined) {
  if (!user) return user
  const { password: _password, ...safeUser } = user
  return safeUser
}

export function getTokenFromEvent(event: H3Event): string | null {
  const cookie = getCookie(event, 'auth_token')
  if (cookie) return cookie

  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}

export async function getUserFromEvent(event: H3Event) {
  const token = getTokenFromEvent(event)
  if (!token) return null
  return getUserFromToken(token)
}

export async function requireAuth(event: H3Event) {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}

// Simple in-memory rate limiter. For production, use Redis or Nitro storage.
interface RateLimitEntry {
  count: number
  resetAt: number
}
const rateLimitMap = new Map<string, RateLimitEntry>()

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true }
}

export function getRateLimitKey(event: H3Event, prefix: string) {
  // Prefer a hashed/unique client identifier. In production use a real IP or user ID.
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  return `${prefix}:${ip}`
}
