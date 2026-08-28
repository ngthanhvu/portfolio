<script setup lang="ts">
import type { Comment } from '~/types/comments'

defineProps<{
    comment: Comment
}>()

const emit = defineEmits<{
    (e: 'like', id: string): void
    (e: 'dislike', id: string): void
    (e: 'reply', id: string): void
    (e: 'share', id: string): void
}>()

</script>

<template>
    <div class="flex gap-3">
        <img :src="comment.user.avatar" :alt="comment.user.name" class="h-10 w-10 rounded-full object-cover flex-shrink-0" />

        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm text-foreground">
                    {{ comment.user.name }}
                </span>
                <span v-if="comment.user.isAuthor"
                    class="inline-flex items-center rounded-sm bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                    Author
                </span>
                <span v-if="comment.replyingTo" class="text-muted-foreground text-sm flex items-center gap-1">
                    <Icon name="lucide:corner-down-right" class="h-3.5 w-3.5" />
                    {{ comment.replyingTo }}
                </span>
                <span class="text-muted-foreground text-sm">
                    {{ comment.createdAt }}
                </span>
            </div>

            <div class="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-line">
                {{ comment.content }}
            </div>

            <div class="mt-2 flex items-center gap-4">
                <button class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    @click="emit('like', comment.id)">
                    <Icon name="lucide:thumbs-up" class="h-4 w-4" />
                    <span>{{ comment.likes }}</span>
                </button>
                <button class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    @click="emit('dislike', comment.id)">
                    <Icon name="lucide:thumbs-down" class="h-4 w-4" />
                    <span>{{ comment.dislikes }}</span>
                </button>
                <button
                    class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    @click="emit('reply', comment.id)">
                    Reply
                </button>
                <button
                    class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    @click="emit('share', comment.id)">
                    <Icon name="lucide:share-2" class="h-4 w-4" />
                </button>
            </div>

            <div v-if="comment.replies.length > 0" class="mt-4 space-y-4">
                <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply"
                    @like="emit('like', $event)" @dislike="emit('dislike', $event)" @reply="emit('reply', $event)"
                    @share="emit('share', $event)" />
            </div>
        </div>
    </div>
</template>
