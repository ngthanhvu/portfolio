<script setup lang="ts">
import type { Comment, CommentSort } from '~/types/comments'

const sort = ref<CommentSort>('best')
const newComment = ref('')
const guestName = ref('')

const currentUser = ref<{ name: string; avatar: string } | null>(null)

function countComments(comments: Comment[]): number {
    return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0)
}

const commentCount = computed(() => countComments(comments.value))

const socialProviders = [
    { name: 'Disqus', color: 'bg-[#2e9fff]', text: 'D' },
    { name: 'Facebook', color: 'bg-[#1877f2]', icon: 'lucide:facebook' },
    { name: 'X', color: 'bg-[#0a0a0a]', icon: 'lucide:x' },
    { name: 'Google', color: 'bg-white border border-border', text: 'G' },
    { name: 'Microsoft', color: 'bg-white border border-border', text: 'M' },
    { name: 'Apple', color: 'bg-[#0a0a0a]', icon: 'lucide:apple' },
]

const comments = ref<Comment[]>([
    {
        id: '1',
        user: {
            id: 'u1',
            name: 'dnauguse',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dnauguse',
        },
        content: `xlog没了真可惜呀！其实作为usdt内容付费还挺不错……\n\nhttps://t.me/dsuse/21695\n\n借着这个机会总结了下自己对AI“入侵编程”的体验，和DIY感觉完全相反（属于是相见恨晚）唉，最近写文越来越长了，都没法内嵌在评论里了。恐怕以后也会走向杰哥和ray宋的行文风格吧……`,
        createdAt: '8 months ago',
        createdAtTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 240).getTime(),
        likes: 2,
        dislikes: 0,
        replies: [
            {
                id: '2',
                user: {
                    id: 'u2',
                    name: 'DIYgod',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diygod',
                    isAuthor: true,
                },
                content: '🤔 难道审美、洞察力就能比得过 AI 了吗？',
                createdAt: '5 months ago',
                createdAtTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).getTime(),
                likes: 0,
                dislikes: 0,
                replyingTo: 'dnauguse',
                replies: [],
            },
            {
                id: '3',
                user: {
                    id: 'u3',
                    name: 'judg',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judg',
                },
                content: 'xlog发生什么事了，之前就发现博客进不去了',
                createdAt: '6 months ago',
                createdAtTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).getTime(),
                likes: 0,
                dislikes: 0,
                replyingTo: 'dnauguse',
                replies: [],
            },
        ],
    },
    {
        id: '4',
        user: {
            id: 'u4',
            name: '麓下雪',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luxiaxue',
        },
        content: '很好的分享，日常离不开folo应用，祝folo越来越好。',
        createdAt: '8 months ago',
        createdAtTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 240).getTime(),
        likes: 2,
        dislikes: 0,
        replies: [],
    },
])

const sortedComments = computed(() => {
    const list = [...comments.value]
    if (sort.value === 'newest') {
        return list.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp)
    }
    if (sort.value === 'oldest') {
        return list.sort((a, b) => a.createdAtTimestamp - b.createdAtTimestamp)
    }
    return list.sort((a, b) => b.likes - a.likes)
})

function handleSubmit() {
    if (!newComment.value.trim()) return
    comments.value.unshift({
        id: Date.now().toString(),
        user: {
            id: 'me',
            name: currentUser.value?.name || guestName.value || 'Anonymous',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
        },
        content: newComment.value,
        createdAt: 'Just now',
        createdAtTimestamp: Date.now(),
        likes: 0,
        dislikes: 0,
        replies: [],
    })
    newComment.value = ''
}

function handleLike(id: string) {
    console.log('like', id)
}

function handleDislike(id: string) {
    console.log('dislike', id)
}

function handleReply(id: string) {
    console.log('reply', id)
}

function handleShare(id: string) {
    console.log('share', id)
}
</script>

<template>
    <section class="w-full max-w-3xl mx-auto py-6 text-foreground">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">
                {{ commentCount }} comments
            </h2>
            <button class="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Login
                <Icon name="lucide:chevron-down" class="h-4 w-4" />
            </button>
        </div>

        <div class="flex gap-3 mb-6">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" alt="Guest"
                class="h-10 w-10 rounded-full object-cover flex-shrink-0" />
            <div class="flex-1">
                <textarea v-model="newComment" rows="3" placeholder="Join the discussion…"
                    class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    @keydown.enter.prevent="handleSubmit"></textarea>

                <div v-if="!currentUser" class="mt-3 space-y-3">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="text-sm text-muted-foreground">Login with:</span>
                        <div class="flex items-center gap-2">
                            <button v-for="provider in socialProviders" :key="provider.name"
                                :title="provider.name"
                                class="h-9 w-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                                :class="provider.color">
                                <Icon v-if="provider.icon" :name="provider.icon" class="h-4 w-4" />
                                <span v-else class="text-sm font-bold"
                                    :class="provider.name === 'Google' || provider.name === 'Microsoft' ? 'text-foreground' : ''">
                                    {{ provider.text }}
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <span class="text-sm text-muted-foreground pt-2">Or register a Disqus account</span>
                        <input v-model="guestName" type="text" placeholder="Name"
                            class="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4 text-sm">
                <button class="inline-flex items-center gap-1 text-foreground hover:text-foreground transition-colors">
                    <Icon name="lucide:heart" class="h-4 w-4" />
                    <span>9</span>
                </button>
                <span class="text-muted-foreground">·</span>
                <button class="text-sm font-medium text-foreground hover:underline">
                    Share
                </button>
            </div>
            <div class="flex items-center gap-4 text-sm">
                <button class="font-medium transition-colors"
                    :class="sort === 'best' ? 'text-blue-600 underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                    @click="sort = 'best'">
                    Best
                </button>
                <button class="font-medium transition-colors"
                    :class="sort === 'newest' ? 'text-blue-600 underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                    @click="sort = 'newest'">
                    Newest
                </button>
                <button class="font-medium transition-colors"
                    :class="sort === 'oldest' ? 'text-blue-600 underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                    @click="sort = 'oldest'">
                    Oldest
                </button>
            </div>
        </div>

        <div class="space-y-6">
            <CommentItem v-for="comment in sortedComments" :key="comment.id" :comment="comment" @like="handleLike"
                @dislike="handleDislike" @reply="handleReply" @share="handleShare" />
        </div>
    </section>
</template>
