import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    id: user.id,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  }
})
