import { relations } from 'drizzle-orm'
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
} from 'drizzle-orm/mysql-core'

// -------------------------------
// Users / Authors
// -------------------------------
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  nickname: varchar('nickname', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatar: varchar('avatar', { length: 512 }),
  bio: text('bio'),
  role: varchar('role', { length: 50 }).notNull().default('author'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// -------------------------------
// Blog Posts
// -------------------------------
export const posts = mysqlTable('posts', {
  id: int('id').autoincrement().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: varchar('cover_image', { length: 512 }),
  category: varchar('category', { length: 100 }).notNull(),
  authorId: int('author_id').references(() => users.id, { onDelete: 'set null' }),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  readTime: varchar('read_time', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index('slug_idx').on(table.slug),
  categoryIdx: index('category_idx').on(table.category),
  authorIdx: index('author_idx').on(table.authorId),
}))

// -------------------------------
// Tags
// -------------------------------
export const tags = mysqlTable('tags', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
})

// -------------------------------
// Post <-> Tag junction
// -------------------------------
export const postTags = mysqlTable('post_tags', {
  postId: int('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: int('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: index('post_tag_pk').on(table.postId, table.tagId),
}))

// -------------------------------
// Comments (nested replies supported)
// -------------------------------
export const comments = mysqlTable('comments', {
  id: int('id').autoincrement().primaryKey(),
  postId: int('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  parentId: int('parent_id'),
  userId: int('user_id').references(() => users.id, { onDelete: 'set null' }),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorAvatar: varchar('author_avatar', { length: 512 }),
  content: text('content').notNull(),
  likes: int('likes').default(0).notNull(),
  dislikes: int('dislikes').default(0).notNull(),
  isAuthor: boolean('is_author').default(false).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('approved'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  postIdx: index('comment_post_idx').on(table.postId),
  parentIdx: index('comment_parent_idx').on(table.parentId),
  statusIdx: index('comment_status_idx').on(table.status),
}))

// -------------------------------
// Projects
// -------------------------------
export const projects = mysqlTable('projects', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  image: varchar('image', { length: 512 }),
  url: varchar('url', { length: 512 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// -------------------------------
// Project Tags (optional many-to-many)
// -------------------------------
export const projectTags = mysqlTable('project_tags', {
  projectId: int('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  tagId: int('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: index('project_tag_pk').on(table.projectId, table.tagId),
}))

// -------------------------------
// Social Links
// -------------------------------
export const socialLinks = mysqlTable('social_links', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  url: varchar('url', { length: 512 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  displayOrder: int('display_order').default(0).notNull(),
})

// -------------------------------
// Site Profile / Settings (single-row config)
// -------------------------------
export const profiles = mysqlTable('profiles', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  nickname: varchar('nickname', { length: 255 }).notNull(),
  tagline: varchar('tagline', { length: 255 }),
  bio: text('bio'),
  avatar: varchar('avatar', { length: 512 }),
  email: varchar('email', { length: 255 }),
  startDate: varchar('start_date', { length: 50 }),
})

// -------------------------------
// Relations
// -------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
  postTags: many(postTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
  projectTags: many(projectTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'commentTree',
  }),
  replies: many(comments, { relationName: 'commentTree' }),
  author: one(users, { fields: [comments.userId], references: [users.id] }),
}))

export const projectsRelations = relations(projects, ({ many }) => ({
  projectTags: many(projectTags),
}))

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, { fields: [projectTags.projectId], references: [projects.id] }),
  tag: one(tags, { fields: [projectTags.tagId], references: [tags.id] }),
}))

// -------------------------------
// Type exports
// -------------------------------
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert

export type PostTag = typeof postTags.$inferSelect
export type NewPostTag = typeof postTags.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type ProjectTag = typeof projectTags.$inferSelect
export type NewProjectTag = typeof projectTags.$inferInsert

export type SocialLink = typeof socialLinks.$inferSelect
export type NewSocialLink = typeof socialLinks.$inferInsert

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
