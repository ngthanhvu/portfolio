import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { comments } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const postId = query.postId ? Number(query.postId) : undefined

  const list = await db.query.comments.findMany({
    where: postId ? eq(comments.postId, postId) : undefined,
    with: {
      author: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  })

  return { data: list }
})
