import { db } from '../../utils/db'
import { posts } from '../../db/schema'

export default defineEventHandler(async () => {
  const list = await db.query.posts.findMany({
    columns: { slug: true, updatedAt: true },
    orderBy: (posts, { desc }) => [desc(posts.publishedAt)],
  })

  return list.map((post) => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updatedAt,
  }))
})