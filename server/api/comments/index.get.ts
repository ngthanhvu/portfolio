import { and, eq, inArray } from 'drizzle-orm'
import { db } from '../../utils/db'
import { comments, commentVotes } from '../../db/schema'
import { getTokenFromEvent, getUserFromToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const postId = query.postId ? Number(query.postId) : undefined

  const token = getTokenFromEvent(event)
  const user = token ? await getUserFromToken(token) : null

  const list = await db.query.comments.findMany({
    where: postId ? eq(comments.postId, postId) : undefined,
    with: {
      author: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  })

  let userVoteMap = new Map<number, 'like' | 'dislike'>()

  if (user && list.length > 0) {
    const commentIds = list.map((c) => c.id)
    const votes = await db.query.commentVotes.findMany({
      where: and(
        inArray(commentVotes.commentId, commentIds),
        eq(commentVotes.userId, user.id),
      ),
    })
    votes.forEach((vote) => {
      userVoteMap.set(vote.commentId, vote.type as 'like' | 'dislike')
    })
  }

  const withUserVote = (comment: typeof list[number]) => ({
    ...comment,
    userVote: userVoteMap.get(comment.id) || null,
  })

  const rootMap = new Map<number, typeof list[number] & { replies: any[] }>()
  const roots: (typeof list[number] & { replies: any[] })[] = []

  for (const comment of list) {
    if (!comment.parentId) {
      const item = { ...withUserVote(comment), replies: [] }
      roots.push(item)
      rootMap.set(comment.id, item)
    }
  }

  for (const comment of list) {
    if (comment.parentId && rootMap.has(comment.parentId)) {
      rootMap.get(comment.parentId)!.replies.push(withUserVote(comment))
    }
  }

  return { data: roots }
})
