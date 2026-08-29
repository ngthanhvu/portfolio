import { getUserFromToken, getTokenFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getTokenFromEvent(event)

  if (!token) {
    return { user: null }
  }

  const user = await getUserFromToken(token)

  if (!user) {
    return { user: null }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  }
})
