<script setup lang="ts">
import type { CommentSort } from '~/types/comments'

interface CurrentUser {
    id: number
    name: string
    email: string
    role: string
    avatar: string | null
}

const props = defineProps<{
    postId: number
}>()

const sort = ref<CommentSort>('best')
const newComment = ref('')

const currentUser = ref<CurrentUser | null>(null)
const authChecked = ref(false)
const authMode = ref<'login' | 'register'>('login')
const authForm = reactive({ name: '', email: '', password: '' })
const authError = ref('')
const authLoading = ref(false)
const commentError = ref('')

const { data, refresh } = await useFetch(() => `/api/comments?postId=${props.postId}`)

const comments = computed(() => data.value?.data || [])

const commentCount = computed(() => comments.value.length)

const currentUserAvatar = computed(() =>
    currentUser.value?.avatar
    || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.value?.email || 'guest')}`,
)

const sortedComments = computed(() => {
    const list = [...comments.value]
    if (sort.value === 'newest') {
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    if (sort.value === 'oldest') {
        return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
    return list.sort((a, b) => b.likes - a.likes)
})

onMounted(async () => {
    try {
        const { user } = await $fetch<{ user: CurrentUser | null }>('/api/auth/me', { credentials: 'include' })
        currentUser.value = user
    }
    catch {
        currentUser.value = null
    }
    finally {
        authChecked.value = true
    }
})

async function handleSubmit() {
    if (!newComment.value.trim() || !currentUser.value) return

    commentError.value = ''
    try {
        await $fetch('/api/comments', {
            method: 'POST',
            body: { postId: props.postId, content: newComment.value },
            credentials: 'include',
        })
        newComment.value = ''
        await refresh()
    }
    catch (err: any) {
        commentError.value = err?.data?.message || 'Failed to post comment'
    }
}

async function handleAuth() {
    authError.value = ''
    authLoading.value = true

    try {
        const url = authMode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
        const body = authMode.value === 'login'
            ? { email: authForm.email, password: authForm.password }
            : { name: authForm.name, email: authForm.email, password: authForm.password }

        currentUser.value = await $fetch<CurrentUser>(url, { method: 'POST', body })
        authForm.name = ''
        authForm.email = ''
        authForm.password = ''
    }
    catch (err: any) {
        authError.value = err?.data?.message || err?.message || 'Authentication failed'
    }
    finally {
        authLoading.value = false
    }
}

async function handleLogout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    currentUser.value = null
    authMode.value = 'login'
}

function handleLike(id: number) {
    console.log('like', id)
}

async function handleDislike(id: number) {
    console.log('dislike', id)
}

async function handleReply(id: number) {
    console.log('reply', id)
}

async function handleShare(id: number) {
    console.log('share', id)
}
</script>

<template>
    <section class="w-full max-w-3xl mx-auto py-6 text-foreground">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">
                {{ commentCount }} comments
            </h2>
            <button v-if="currentUser" class="text-sm text-muted-foreground hover:text-foreground"
                @click="handleLogout">
                Logout
            </button>
        </div>

        <!-- Composer when logged in -->
        <div v-if="authChecked && currentUser" class="flex gap-3 mb-6">
            <img :src="currentUserAvatar" :alt="currentUser.name"
                class="h-10 w-10 rounded-full object-cover shrink-0" />
            <div class="flex-1">
                <textarea v-model="newComment" rows="3" placeholder="Join the discussion…"
                    class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    @keydown.enter.prevent="handleSubmit"></textarea>

                <div class="mt-3 flex items-center justify-between gap-3">
                    <span class="text-sm text-muted-foreground">
                        Commenting as
                        <span class="font-medium text-foreground">{{ currentUser.name }}</span>
                    </span>
                    <button type="button"
                        class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                        :disabled="!newComment.trim()" @click="handleSubmit">
                        Comment
                    </button>
                </div>

                <p v-if="commentError" class="mt-2 text-sm text-red-600">
                    {{ commentError }}
                </p>
            </div>
        </div>

        <!-- Auth panel when not logged in -->
        <div v-else-if="authChecked && !currentUser" class="mb-6 rounded-lg border border-border p-4">
            <div class="flex gap-2 mb-4">
                <button type="button" class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                    :class="authMode === 'login' ? 'bg-neutral-900 text-white' : 'text-muted-foreground hover:text-foreground'"
                    @click="authMode = 'login'">
                    Login
                </button>
                <button type="button" class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                    :class="authMode === 'register' ? 'bg-neutral-900 text-white' : 'text-muted-foreground hover:text-foreground'"
                    @click="authMode = 'register'">
                    Register
                </button>
            </div>

            <p class="mb-3 text-sm text-muted-foreground">
                {{ authMode === 'login' ? 'Login to join the discussion.' : 'Create an account to comment.' }}
            </p>

            <form class="space-y-3" @submit.prevent="handleAuth">
                <input v-if="authMode === 'register'" v-model="authForm.name" type="text" placeholder="Name" required
                    class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input v-model="authForm.email" type="email" placeholder="Email" required
                    class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input v-model="authForm.password" type="password" placeholder="Password" required
                    class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />

                <p v-if="authError" class="text-sm text-red-600">
                    {{ authError }}
                </p>

                <button type="submit" :disabled="authLoading"
                    class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
                    {{ authLoading ? 'Please wait…' : (authMode === 'login' ? 'Login' : 'Register') }}
                </button>
            </form>
        </div>

        <!-- Loading auth state -->
        <div v-else class="mb-6 text-sm text-muted-foreground">
            Loading…
        </div>

        <div class="flex items-center justify-end mb-6 gap-4 text-sm">
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

        <div class="space-y-6">
            <CommentItem v-for="comment in sortedComments" :key="comment.id" :comment="comment" @like="handleLike"
                @dislike="handleDislike" @reply="handleReply" @share="handleShare" />
        </div>
    </section>
</template>
