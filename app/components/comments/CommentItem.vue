<script setup lang="ts">
import type { Comment } from '~/types/comments'

defineProps<{
    comment: Comment
}>()

const emit = defineEmits<{
    (e: 'like', id: number): void
    (e: 'dislike', id: number): void
    (e: 'reply', id: number): void
    (e: 'share', id: number): void
}>()
</script>

<template>
    <div class="flex gap-3">
        <img :src="comment.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'" :alt="comment.authorName"
            class="h-10 w-10 rounded-full object-cover flex-shrink-0" />

        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm text-foreground">
                    {{ comment.authorName }}
                </span>
                <span v-if="comment.isAuthor"
                    class="inline-flex items-center rounded-sm bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                    Author
                </span>
                <span class="text-muted-foreground text-sm">
                    {{ new Date(comment.createdAt).toLocaleDateString() }}
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
        </div>
    </div>
</template>
