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
      :alt="comment.authorName" class="h-10 w-10 shrink-0 border border-zinc-800 object-cover" />

    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[13px] font-semibold text-zinc-100">
          {{ comment.authorName }}
        </span>
        <span v-if="comment.isAuthor"
          class="label-mono inline-flex items-center border border-sky-500/40 bg-sky-500/10 px-1.5 py-0.5 text-[10px] text-sky-300">
          Author
        </span>
        <span class="label-mono text-[11px] text-zinc-600">
          {{ formatDate(comment.createdAt) }}
        </span>
      </div>

      <div class="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-zinc-300">
        {{ comment.content }}
      </div>

      <div class="mt-2 flex items-center gap-4">
        <button class="label-mono flex cursor-pointer items-center gap-1 text-[11px] transition-colors duration-150"
          :class="isLiked ? 'border-sky-400 text-sky-300' : 'text-zinc-500 hover:text-zinc-100'"
          @click="emit('like', comment.id)">
          <Icon name="lucide:thumbs-up" class="h-4 w-4" :class="isLiked ? 'fill-current' : ''" />
          <span>{{ comment.likes }}</span>
        </button>
        <button class="label-mono flex cursor-pointer items-center gap-1 text-[11px] transition-colors duration-150"
          :class="isDisliked ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-100'"
          @click="emit('dislike', comment.id)">
          <Icon name="lucide:thumbs-down" class="h-4 w-4" :class="isDisliked ? 'fill-current' : ''" />
          <span>{{ comment.dislikes }}</span>
        </button>
        <button v-if="isAdmin"
          class="label-mono cursor-pointer text-[11px] text-zinc-500 transition-colors duration-150 hover:text-zinc-100"
          @click="showReplyForm = !showReplyForm">
          Reply
        </button>
        <button
          class="label-mono flex cursor-pointer items-center gap-1 text-[11px] text-zinc-500 transition-colors duration-150 hover:text-zinc-100"
          @click="emit('share', comment.id)">
          <Icon name="lucide:share-2" class="h-4 w-4" />
        </button>
      </div>

      <!-- Reply form (admin only) -->
      <div v-if="showReplyForm" class="mt-3">
        <textarea v-model="replyContent" rows="2" placeholder="Write a reply…"
          class="w-full resize-none border border-zinc-800 bg-black px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400"
          @keydown.enter.exact.prevent="submitReply" />
        <div class="mt-2 flex items-center gap-2">
          <button type="button" :disabled="!replyContent.trim()"
            class="label-mono inline-flex items-center border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-[11px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200 active:bg-sky-500/30 disabled:pointer-events-none disabled:opacity-40"
            @click="submitReply">
            Reply
          </button>
          <button type="button"
            class="label-mono inline-flex items-center border border-zinc-700/80 bg-zinc-900/60 px-3 py-1.5 text-[11px] text-zinc-300 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
            @click="cancelReply">
            Cancel
          </button>
        </div>
      </div>

      <!-- Replies (one level deep) -->
      <div v-if="comment.replies?.length" class="mt-3 space-y-3 border-l border-zinc-800 pl-4">
        <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-3">
          <img :src="reply.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'"
            :alt="reply.authorName" class="h-8 w-8 shrink-0 border border-zinc-800 object-cover" />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[13px] font-semibold text-zinc-100">
                {{ reply.authorName }}
              </span>
              <span v-if="reply.isAuthor"
                class="label-mono inline-flex items-center border border-sky-500/40 bg-sky-500/10 px-1.5 py-0.5 text-[10px] text-sky-300">
                Author
              </span>
              <span class="label-mono text-[11px] text-zinc-600">
                {{ formatDate(reply.createdAt) }}
              </span>
            </div>
            <div class="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-zinc-300">
              {{ reply.content }}
            </div>
            <div class="mt-1 flex items-center gap-3">
              <span class="label-mono flex items-center gap-1 text-[11px]"
                :class="reply.userVote === 'like' ? 'text-sky-300' : 'text-zinc-600'">
                <Icon name="lucide:thumbs-up" class="h-3.5 w-3.5" />
                {{ reply.likes }}
              </span>
              <span class="label-mono flex items-center gap-1 text-[11px]"
                :class="reply.userVote === 'dislike' ? 'text-red-400' : 'text-zinc-600'">
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
