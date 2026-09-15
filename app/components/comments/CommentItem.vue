<script setup lang="ts">
import type { Comment } from '~/types/comments'

interface CurrentUser {
  id: number
  name: string
  email: string
  role: string
  avatar: string | null
}

interface ReplyPayload {
  id: number
  content: string
}

const props = defineProps<{
  comment: Comment
  currentUser: CurrentUser | null
}>()

const emit = defineEmits<{
  (e: 'like', id: number): void
  (e: 'dislike', id: number): void
  (e: 'reply', payload: ReplyPayload): void
  (e: 'share', id: number): void
}>()

const showReplyForm = ref(false)
const replyContent = ref('')

const isLiked = computed(() => props.comment.userVote === 'like')
const isDisliked = computed(() => props.comment.userVote === 'dislike')
const isAdmin = computed(() => props.currentUser?.role === 'admin')

function submitReply() {
  if (!replyContent.value.trim()) return
  emit('reply', { id: props.comment.id, content: replyContent.value })
  replyContent.value = ''
  showReplyForm.value = false
}

function cancelReply() {
  replyContent.value = ''
  showReplyForm.value = false
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<template>
  <div class="flex gap-3">
    <img :src="comment.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'"
      :alt="comment.authorName" class="h-10 w-10 shrink-0 rounded-full object-cover" />

    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold text-foreground">
          {{ comment.authorName }}
        </span>
        <span v-if="comment.isAuthor"
          class="inline-flex items-center rounded-sm bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
          Author
        </span>
        <span class="text-sm text-muted-foreground">
          {{ formatDate(comment.createdAt) }}
        </span>
      </div>

      <div class="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {{ comment.content }}
      </div>

      <div class="mt-2 flex items-center gap-4">
        <button class="flex cursor-pointer items-center gap-1 text-sm transition-colors"
          :class="isLiked ? 'font-medium text-blue-600' : 'text-muted-foreground hover:text-foreground'"
          @click="emit('like', comment.id)">
          <Icon name="lucide:thumbs-up" class="h-4 w-4" :class="isLiked ? 'fill-current' : ''" />
          <span>{{ comment.likes }}</span>
        </button>
        <button class="flex cursor-pointer items-center gap-1 text-sm transition-colors"
          :class="isDisliked ? 'font-medium text-red-600' : 'text-muted-foreground hover:text-foreground'"
          @click="emit('dislike', comment.id)">
          <Icon name="lucide:thumbs-down" class="h-4 w-4" :class="isDisliked ? 'fill-current' : ''" />
          <span>{{ comment.dislikes }}</span>
        </button>
        <button v-if="isAdmin" class="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          @click="showReplyForm = !showReplyForm">
          Reply
        </button>
        <button class="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          @click="emit('share', comment.id)">
          <Icon name="lucide:share-2" class="h-4 w-4" />
        </button>
      </div>

      <!-- Reply form (admin only) -->
      <div v-if="showReplyForm" class="mt-3">
        <textarea v-model="replyContent" rows="2" placeholder="Write a reply…"
          class="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-slate-400 hover:border-slate-300"
          @keydown.enter.exact.prevent="submitReply" />
        <div class="mt-2 flex items-center gap-2">
          <button type="button" :disabled="!replyContent.trim()"
            class="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            @click="submitReply">
            Reply
          </button>
          <button type="button"
            class="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            @click="cancelReply">
            Cancel
          </button>
        </div>
      </div>

      <!-- Replies (one level deep) -->
      <div v-if="comment.replies?.length" class="mt-3 space-y-3 pl-4">
        <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-3">
          <img :src="reply.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'"
            :alt="reply.authorName" class="h-8 w-8 shrink-0 rounded-full object-cover" />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-semibold text-foreground">
                {{ reply.authorName }}
              </span>
              <span v-if="reply.isAuthor"
                class="inline-flex items-center rounded-sm bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                Author
              </span>
              <span class="text-sm text-muted-foreground">
                {{ formatDate(reply.createdAt) }}
              </span>
            </div>
            <div class="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {{ reply.content }}
            </div>
            <div class="mt-1 flex items-center gap-3">
              <span class="flex items-center gap-1 text-sm"
                :class="reply.userVote === 'like' ? 'text-foreground' : 'text-muted-foreground'">
                <Icon name="lucide:thumbs-up" class="h-3.5 w-3.5" />
                {{ reply.likes }}
              </span>
              <span class="flex items-center gap-1 text-sm"
                :class="reply.userVote === 'dislike' ? 'text-foreground' : 'text-muted-foreground'">
                <Icon name="lucide:thumbs-down" class="h-3.5 w-3.5" />
                {{ reply.dislikes }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
