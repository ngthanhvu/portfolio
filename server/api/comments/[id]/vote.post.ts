import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { comments, commentVotes } from '../../../db/schema'
import { getTokenFromEvent, getUserFromToken } from '../../../utils/auth'

const bodySchema = z.object({
  type: z.enum(['like', 'dislike', 'remove']),
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment ID' })
  }

  const token = getTokenFromEvent(event)
  const user = token ? await getUserFromToken(token) : null

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Login required to vote' })
  }

  const body = await readValidatedBody(event, bodySchema.parse)
  const voteType = body.type === 'remove' ? null : body.type

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
  })

  if (!comment) {
    throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
  }

  const existingVote = await db.query.commentVotes.findFirst({
    where: and(
      eq(commentVotes.commentId, id),
      eq(commentVotes.userId, user.id),
    ),
  })

  // No existing vote and we want to remove -> nothing to do
  if (!existingVote && !voteType) {
    return { success: true, vote: null }
  }

  // New vote
  if (!existingVote && voteType) {
    await db.insert(commentVotes).values({
      commentId: id,
      userId: user.id,
      type: voteType,
    })
    await db.update(comments)
      .set({
        likes: voteType === 'like' ? comment.likes + 1 : comment.likes,
        dislikes: voteType === 'dislike' ? comment.dislikes + 1 : comment.dislikes,
      })
      .where(eq(comments.id, id))
    return { success: true, vote: voteType }
  }

  // Existing vote exists
  if (existingVote) {
    const isSameVote = voteType === existingVote.type
    const isRemove = !voteType || isSameVote

    if (isRemove) {
      // Remove vote
      await db.delete(commentVotes).where(eq(commentVotes.id, existingVote.id))
      await db.update(comments)
        .set({
          likes: existingVote.type === 'like'
            ? Math.max(0, comment.likes - 1)
            : comment.likes,
          dislikes: existingVote.type === 'dislike'
            ? Math.max(0, comment.dislikes - 1)
            : comment.dislikes,
        })
        .where(eq(comments.id, id))
      return { success: true, vote: null }
    }

    // Change vote type
    await db.update(commentVotes)
      .set({ type: voteType })
      .where(eq(commentVotes.id, existingVote.id))
    await db.update(comments)
      .set({
        likes: voteType === 'like'
          ? comment.likes + 1
          : Math.max(0, comment.likes - 1),
        dislikes: voteType === 'dislike'
          ? comment.dislikes + 1
          : Math.max(0, comment.dislikes - 1),
      })
      .where(eq(comments.id, id))
    return { success: true, vote: voteType }
  }
})
