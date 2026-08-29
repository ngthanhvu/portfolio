import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { db } from '../utils/db'
import {
  comments,
  postTags,
  posts,
  profiles,
  projects,
  socialLinks,
  tags,
  users,
} from './schema'

async function seed() {
  console.log('Seeding started...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Clean existing data
  await db.delete(comments)
  await db.delete(postTags)
  await db.delete(tags)
  await db.delete(posts)
  await db.delete(projects)
  await db.delete(socialLinks)
  await db.delete(profiles)
  await db.delete(users)

  // Seed users / authors
  const [admin] = await db
    .insert(users)
    .values({
      name: 'Admin',
      nickname: 'admin',
      email: 'admin@thanhvu.net',
      password: hashedPassword,
      avatar: 'https://i.pravatar.cc/150?u=admin',
      bio: 'Quản trị viên hệ thống.',
      role: 'admin',
    })
    .$returningId()

  if (!admin?.id) {
    throw new Error('Failed to seed admin user')
  }

  // Seed profile
  await db.insert(profiles).values({
    name: 'Admin',
    nickname: 'admin',
    tagline: 'Code is my craft, bugs are my teachers.',
    bio: 'Một lập trình viên đam mê xây dựng sản phẩm đẹp, đơn giản và hữu ích.',
    avatar: 'https://i.pravatar.cc/300?u=portfolio',
    email: 'admin@thanhvu.net',
    startDate: '2020-01-01',
  })

  // Seed social links
  await db.insert(socialLinks).values([
    { name: 'GitHub', url: 'https://github.com', icon: 'simple-icons:github', displayOrder: 1 },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'simple-icons:twitter', displayOrder: 2 },
    { name: 'RSS', url: '/feed', icon: 'simple-icons:rss', displayOrder: 3 },
    { name: 'Email', url: 'mailto:hello@deva.dev', icon: 'lucide:mail', displayOrder: 4 },
  ])

  // Seed projects
  await db.insert(projects).values([
    {
      name: 'Portfolio Nuxt',
      description: 'Trang portfolio cá nhân xây dựng với Nuxt 4, Tailwind CSS và Drizzle ORM.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d7f2f5a8?w=800&q=80',
      url: 'https://github.com/deva/portfolio',
    },
    {
      name: 'Blog CMS',
      description: 'Hệ thống quản lý nội dung blog tích hợp comment và quản lý bài viết.',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
      url: 'https://github.com/deva/blog-cms',
    },
  ])

  // Seed tags
  const tagNames = ['Tailwind CSS', 'CSS', 'Frontend', 'Vue 3', 'JavaScript', 'Nuxt', 'API']
  const insertedTags = await db.insert(tags).values(
    tagNames.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }))
  )

  // Seed posts
  const [post1Result] = await db
    .insert(posts)
    .values({
      slug: 'kham-pha-tailwindcss-v4',
      title: 'Khám phá Tailwind CSS v4: Những điểm mới đáng chú ý',
      excerpt:
        'Tailwind CSS v4 mang đến nhiều cải tiến về hiệu suất và cú pháp. Cùng điểm qua những tính năng mới nhất.',
      content: `<p>Tailwind CSS v4 đã chính thức ra mắt với nhiều thay đổi lớn...</p>`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d7f2f5a8?w=800&q=80',
      category: 'Frontend',
      authorId: admin.id,
      publishedAt: new Date('2026-08-27'),
      readTime: '5 phút',
    })
    .$returningId()

  const [post2] = await db
    .insert(posts)
    .values({
      slug: 'vue-3-composition-api',
      title: 'Vue 3 Composition API: Hướng dẫn toàn diện',
      excerpt:
        'Hiểu rõ Composition API trong Vue 3 và cách tổ chức logic tốt hơn cho ứng dụng của bạn.',
      content: `<p>Composition API là một trong những tính năng lớn nhất của Vue 3...</p>`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f1340f3c0d9c?w=800&q=80',
      category: 'Vue',
      authorId: admin.id,
      publishedAt: new Date('2026-08-25'),
      readTime: '8 phút',
    })
    .$returningId()

  if (!post1Result?.id || !post2?.id) {
    throw new Error('Failed to seed posts')
  }

  // Link tags to posts
  await db.insert(postTags).values([
    { postId: post1Result.id, tagId: 1 },
    { postId: post1Result.id, tagId: 2 },
    { postId: post2.id, tagId: 3 },
  ])

  // Seed comments
  const [rootComment] = await db
    .insert(comments)
    .values({
      postId: post1Result.id,
      authorName: 'dnauguse',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dnauguse',
      content: 'Bài viết rất hay, cảm ơn bạn đã chia sẻ!',
      likes: 2,
      dislikes: 0,
      status: 'approved',
    })
    .$returningId()

  if (!rootComment?.id) {
    throw new Error('Failed to seed root comment')
  }

  await db.insert(comments).values({
    postId: post1Result.id,
    parentId: rootComment.id,
    authorName: 'DIYgod',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diygod',
    content: 'Đồng ý, bài viết rất chi tiết và dễ hiểu.',
    likes: 1,
    dislikes: 0,
    isAuthor: true,
    status: 'approved',
  })

  console.log('Seeding completed.')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
