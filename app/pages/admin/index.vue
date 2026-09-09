<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Dashboard | Admin',
})

const [
  { data: postsRes },
  { data: projectsRes },
  { data: commentsRes, refresh: refreshComments },
  { data: usersRes },
] = await Promise.all([
  useFetch('/api/posts', { query: { limit: 5 } }),
  useFetch('/api/projects'),
  useFetch('/api/comments'),
  useFetch('/api/users'),
])

const postCount = computed(() => postsRes.value?.pagination?.total ?? postsRes.value?.data?.length ?? 0)
const recentPosts = computed(() => postsRes.value?.data ?? [])
const projectCount = computed(() => projectsRes.value?.data?.length ?? 0)
const commentCount = computed(() => commentsRes.value?.data?.length ?? 0)
const userCount = computed(() => usersRes.value?.data?.length ?? 0)
const pendingComments = computed(() =>
  (commentsRes.value?.data ?? []).filter(c => c.status !== 'approved').slice(0, 5),
)
const pendingCount = computed(() =>
  (commentsRes.value?.data ?? []).filter(c => c.status !== 'approved').length,
)

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

async function deleteComment(id: number) {
  if (!confirm('Delete this comment?')) return
  await $fetch(`/api/comments/${id}`, { method: 'DELETE' })
  await refreshComments()
}

const stats = computed(() => [
  {
    label: 'Posts',
    value: postCount.value,
    icon: 'lucide:file-text',
    to: '/admin/posts',
    hint: 'Published posts',
    accent: false,
  },
  {
    label: 'Projects',
    value: projectCount.value,
    icon: 'lucide:folder-git-2',
    to: '/admin/projects',
    hint: 'Showcased work',
    accent: false,
  },
  {
    label: 'Comments',
    value: commentCount.value,
    icon: 'lucide:message-circle',
    to: '/admin/comments',
    hint: pendingCount.value > 0 ? `${pendingCount.value} pending review` : 'All approved',
    accent: pendingCount.value > 0,
  },
  {
    label: 'Users',
    value: userCount.value,
    icon: 'lucide:users',
    to: '/admin/users',
    hint: 'Authors & admins',
    accent: false,
  },
])
</script>

<template>
  <div class="w-full">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Overview of your portfolio activity.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          to="/admin/posts/create"
          class="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Icon name="lucide:file-plus" class="h-4 w-4" />
          New post
        </NuxtLink>
        <NuxtLink
          to="/admin/projects/create"
          class="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Icon name="lucide:plus" class="h-4 w-4" />
          New project
        </NuxtLink>
      </div>
    </header>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="group rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/40"
      >
        <div class="flex items-center justify-between">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-md"
            :class="stat.accent ? 'bg-red-50 text-red-600' : 'bg-muted text-foreground'"
          >
            <Icon :name="stat.icon" class="h-5 w-5" />
          </span>
          <Icon name="lucide:arrow-up-right" class="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p class="mt-4 text-3xl font-bold text-foreground">
          {{ stat.value }}
        </p>
        <p class="text-sm font-medium text-foreground">
          {{ stat.label }}
        </p>
        <p class="mt-0.5 text-xs text-muted-foreground">
          {{ stat.hint }}
        </p>
      </NuxtLink>
    </div>

    <!-- Recent + Pending -->
    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <FormSection title="Recent Posts" icon="lucide:clock">
          <template #action>
            <NuxtLink
              to="/admin/posts"
              class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              View all
              <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </template>

          <ul v-if="recentPosts.length" class="divide-y divide-border">
            <li
              v-for="post in recentPosts"
              :key="post.id"
              class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div class="min-w-0 flex-1">
                <NuxtLink
                  :to="`/admin/posts/${post.id}`"
                  class="block truncate text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
                >
                  {{ post.title }}
                </NuxtLink>
                <p class="mt-0.5 truncate text-xs text-muted-foreground">
                  <span class="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-medium text-foreground">
                    {{ post.category }}
                  </span>
                  <span class="ml-2">{{ formatDate(post.publishedAt) }}</span>
                </p>
              </div>
              <NuxtLink
                :to="`/admin/posts/${post.id}`"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title="Edit"
              >
                <Icon name="lucide:pencil" class="h-4 w-4" />
              </NuxtLink>
            </li>
          </ul>
          <div
            v-else
            class="rounded-md border border-dashed border-border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground"
          >
            No posts yet.
          </div>
        </FormSection>
      </div>

      <div class="space-y-6">
        <FormSection
          title="Pending Comments"
          :description="pendingCount > 0 ? `${pendingCount} awaiting review` : undefined"
          icon="lucide:alert-circle"
        >
          <template #action>
            <NuxtLink
              to="/admin/comments"
              class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              All
              <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </template>

          <ul v-if="pendingComments.length" class="divide-y divide-border">
            <li
              v-for="comment in pendingComments"
              :key="comment.id"
              class="py-3 first:pt-0 last:pb-0"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="comment.authorAvatar"
                      :src="comment.authorAvatar"
                      :alt="comment.authorName"
                      class="h-6 w-6 rounded-full object-cover"
                    >
                    <div
                      v-else
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground"
                    >
                      {{ (comment.authorName || '?').charAt(0).toUpperCase() }}
                    </div>
                    <span class="truncate text-sm font-medium text-foreground">{{ comment.authorName }}</span>
                  </div>
                  <p class="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {{ comment.content }}
                  </p>
                  <p class="mt-1 text-[11px] text-muted-foreground">
                    on post #{{ comment.postId }} · {{ formatDate(comment.createdAt) }}
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                  title="Delete comment"
                  @click="deleteComment(comment.id)"
                >
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </li>
          </ul>
          <div
            v-else
            class="flex flex-col items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-8 text-center"
          >
            <Icon name="lucide:check-circle-2" class="h-8 w-8 text-green-500" />
            <p class="text-sm text-muted-foreground">
              All caught up — no pending comments.
            </p>
          </div>
        </FormSection>
      </div>
    </div>
  </div>
</template>
