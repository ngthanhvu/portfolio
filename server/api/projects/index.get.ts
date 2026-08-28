import { db } from '../../utils/db'

export default defineEventHandler(async () => {
  const list = await db.query.projects.findMany({
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  })

  return { data: list }
})
