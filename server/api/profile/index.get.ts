import { db } from '../../utils/db'

export default defineEventHandler(async () => {
  const profile = await db.query.profiles.findFirst()
  const links = await db.query.socialLinks.findMany({
    orderBy: (links, { asc }) => [asc(links.displayOrder)],
  })

  return {
    profile,
    socials: links,
  }
})
