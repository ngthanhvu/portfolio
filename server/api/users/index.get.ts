import { db } from '../../utils/db'

export default defineEventHandler(async () => {
  const list = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })

  const safe = list.map((u) => ({
    id: u.id,
    name: u.name,
    nickname: u.nickname,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    createdAt: u.createdAt,
  }))

  return { data: safe }
})
