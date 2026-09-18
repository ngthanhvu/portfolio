<script setup lang="ts">
import type { Comment as CommentType, CommentSort } from '~/types/comments'

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
const showAuthDialog = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)
const showShareDialog = ref(false)
const shareUrl = ref('')
const shareCopied = ref(false)

const { data, refresh } = await useFetch(() => `/api/comments?postId=${props.postId}`)

const comments = computed(() => data.value?.data || [])

const commentCount = computed(() =>
    comments.value.reduce((total, comment) => total + 1 + (comment.replies?.length ?? 0), 0),
)

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

    document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    if (import.meta.client) document.body.style.overflow = ''
})

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && showAuthDialog.value) closeAuthDialog()
}

watch(showAuthDialog, (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
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

function onComposerEnter(e: KeyboardEvent) {
    if (!currentUser.value || e.shiftKey) return
    e.preventDefault()
    handleSubmit()
}

function openAuthDialog() {
    authError.value = ''
    authMode.value = 'login'
    showAuthDialog.value = true
    nextTick(() => emailInput.value?.focus())
}

function closeAuthDialog() {
    showAuthDialog.value = false
}

async function handleAuth() {
    authError.value = ''

    authLoading.value = true

    try {
        const url = authMode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
        const body: Record<string, any> = authMode.value === 'login'
            ? { email: authForm.email, password: authForm.password }
            : { name: authForm.name, email: authForm.email, password: authForm.password }

        currentUser.value = await $fetch<CurrentUser>(url, { method: 'POST', body })
        authForm.name = ''
        authForm.email = ''
        authForm.password = ''
        showAuthDialog.value = false

        if (newComment.value.trim()) {
            await handleSubmit()
        }
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

async function handleLike(id: number) {
    if (!currentUser.value) {
        openAuthDialog()
        return
    }

    const comment = findCommentById(id)
    if (!comment) return

    const type = comment.userVote === 'like' ? 'remove' : 'like'
    await submitVote(id, type)
}

async function handleDislike(id: number) {
    if (!currentUser.value) {
        openAuthDialog()
        return
    }

    const comment = findCommentById(id)
    if (!comment) return

    const type = comment.userVote === 'dislike' ? 'remove' : 'dislike'
    await submitVote(id, type)
}

async function submitVote(id: number, type: 'like' | 'dislike' | 'remove') {
    try {
        await $fetch(`/api/comments/${id}/vote`, {
            method: 'POST',
            body: { type },
            credentials: 'include',
        })
        await refresh()
    }
    catch (err: any) {
        commentError.value = err?.data?.message || 'Failed to vote'
    }
}

function findCommentById(id: number): CommentType | undefined {
    for (const comment of comments.value) {
        if (comment.id === id) return comment
        const reply = comment.replies?.find((r) => r.id === id)
        if (reply) return reply
    }
    return undefined
}

async function handleReply({ id, content }: { id: number; content: string }) {
    if (!currentUser.value || currentUser.value.role !== 'admin') return

    try {
        await $fetch('/api/comments', {
            method: 'POST',
            body: { postId: props.postId, parentId: id, content },
            credentials: 'include',
        })
        await refresh()
    }
    catch (err: any) {
        commentError.value = err?.data?.message || 'Failed to reply'
    }
}

function handleShare(id: number) {
    shareUrl.value = `${window.location.origin}${window.location.pathname}#comment-${id}`
    shareCopied.value = false
    showShareDialog.value = true
}

function closeShareDialog() {
    showShareDialog.value = false
}

async function copyShareUrl() {
    try {
        await navigator.clipboard.writeText(shareUrl.value)
        shareCopied.value = true
        setTimeout(() => (shareCopied.value = false), 2000)
    }
    catch {
        commentError.value = 'Failed to copy link'
    }
}

function shareTo(platform: 'facebook' | 'twitter' | 'linkedin') {
    const url = encodeURIComponent(shareUrl.value)
    let shareLink = ''
    switch (platform) {
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`
            break
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?url=${url}`
            break
        case 'linkedin':
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
            break
    }
    window.open(shareLink, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <section class="mx-auto w-full max-w-3xl py-6 text-foreground">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">
                {{ commentCount }} comments
            </h2>
            <button v-if="currentUser" class="text-sm text-muted-foreground hover:text-foreground"
                @click="handleLogout">
                Logout
            </button>
        </div>

        <!-- Composer: always visible once auth state is known -->
        <div v-if="authChecked" class="mb-6 flex gap-3">
            <img v-if="currentUser" :src="currentUserAvatar" :alt="currentUser.name"
                class="h-10 w-10 shrink-0 rounded-full object-cover" />
            <div v-else
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon name="lucide:message-circle" class="h-5 w-5" />
            </div>

            <div class="flex-1">
                <textarea v-model="newComment" rows="3" placeholder="Join the discussion…"
                    class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-slate-400 hover:border-slate-300"
                    @keydown.enter="onComposerEnter" />

                <div class="mt-3 flex items-center justify-between gap-3">
                    <span class="text-sm text-muted-foreground">
                        <template v-if="currentUser">
                            Commenting as
                            <span class="font-medium text-foreground">{{ currentUser.name }}</span>
                        </template>
                        <template v-else>Login to join the discussion.</template>
                    </span>

                    <button v-if="currentUser" type="button" :disabled="!newComment.trim()"
                        class="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                        @click="handleSubmit">
                        Comment
                    </button>
                    <button v-else type="button"
                        class="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                        @click="openAuthDialog">
                        <Icon name="lucide:log-in" class="h-4 w-4" />
                        Login to comment
                    </button>
                </div>

                <p v-if="commentError" class="mt-2 text-sm text-red-600">
                    {{ commentError }}
                </p>
            </div>
        </div>

        <!-- Loading auth state -->
        <div v-else class="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
            Loading…
        </div>

        <div class="mb-6 flex items-center justify-end gap-4 text-sm">
            <button class="font-medium transition-colors cursor-pointer"
                :class="sort === 'best' ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                @click="sort = 'best'">
                Best
            </button>
            <button class="font-medium transition-colors cursor-pointer"
                :class="sort === 'newest' ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                @click="sort = 'newest'">
                Newest
            </button>
            <button class="font-medium transition-colors cursor-pointer"
                :class="sort === 'oldest' ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                @click="sort = 'oldest'">
                Oldest
            </button>
        </div>

        <div class="space-y-4">
            <CommentItem v-for="comment in sortedComments" :key="comment.id" :comment="comment"
                :current-user="currentUser" @like="handleLike" @dislike="handleDislike" @reply="handleReply"
                @share="handleShare" />
        </div>

        <!-- Auth dialog -->
        <Teleport to="body">
            <Transition name="auth">
                <div v-if="showAuthDialog" class="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeAuthDialog" />
                    <div
                        class="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                        <div class="flex items-center justify-between border-b border-border px-6 py-4">
                            <h3 class="text-base font-semibold text-foreground">
                                {{ authMode === 'login' ? 'Login' : 'Create account' }}
                            </h3>
                            <button type="button" class="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Close" @click="closeAuthDialog">
                                <Icon name="lucide:x" class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="mb-4 flex gap-1 rounded-md bg-muted p-1">
                                <button type="button"
                                    class="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors"
                                    :class="authMode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                                    @click="authMode = 'login'">
                                    Login
                                </button>
                                <button type="button"
                                    class="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors"
                                    :class="authMode === 'register' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                                    @click="authMode = 'register'">
                                    Register
                                </button>
                            </div>

                            <p class="mb-3 text-sm text-muted-foreground">
                                {{
                                    authMode === 'login' ? 'Login to join the discussion.' :
                                        'Create an account to comment.'
                                }}
                            </p>

                            <form class="space-y-3" @submit.prevent="handleAuth">
                                <input v-if="authMode === 'register'" v-model="authForm.name" type="text"
                                    placeholder="Name" required
                                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300">
                                <input ref="emailInput" v-model="authForm.email" type="email" placeholder="Email"
                                    required
                                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300">
                                <input v-model="authForm.password" type="password" placeholder="Password" required
                                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300">

                                <p v-if="authError" class="flex items-center gap-2 text-sm text-red-600">
                                    <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
                                    {{ authError }}
                                </p>

                                <button type="submit" :disabled="authLoading"
                                    class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                                    <Icon v-if="authLoading" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
                                    {{
                                        authLoading ? 'Please wait…' : (authMode === 'login' ? 'Login' : 'Create account')
                                    }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Share dialog -->
        <Teleport to="body">
            <Transition name="share">
                <div v-if="showShareDialog" class="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeShareDialog" />
                    <div
                        class="relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-card p-6 shadow-xl">
                        <div class="mb-4 flex items-center justify-between">
                            <h3 class="text-base font-semibold text-foreground">
                                Share comment
                            </h3>
                            <button type="button" class="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Close" @click="closeShareDialog">
                                <Icon name="lucide:x" class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="flex items-center gap-2">
                            <input :value="shareUrl" readonly
                                class="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none" />
                            <button type="button"
                                class="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                                @click="copyShareUrl">
                                <Icon name="lucide:copy" class="h-4 w-4" />
                                {{ shareCopied ? 'Copied' : 'Copy' }}
                            </button>
                        </div>

                        <div class="mt-4 flex items-center justify-center gap-4">
                            <button type="button"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-90"
                                aria-label="Share on Facebook" @click="shareTo('facebook')">
                                <Icon name="lucide:facebook" class="h-5 w-5" />
                            </button>
                            <button type="button"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
                                aria-label="Share on X" @click="shareTo('twitter')">
                                <Icon name="lucide:twitter" class="h-5 w-5" />
                            </button>
                            <button type="button"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-opacity hover:opacity-90"
                                aria-label="Share on LinkedIn" @click="shareTo('linkedin')">
                                <Icon name="lucide:linkedin" class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </section>
</template>

<style scoped>
.auth-enter-active,
.auth-leave-active {
    transition: opacity 0.15s ease;
}

.auth-enter-from,
.auth-leave-to {
    opacity: 0;
}

.share-enter-active,
.share-leave-active {
    transition: opacity 0.15s ease;
}

.share-enter-from,
.share-leave-to {
    opacity: 0;
}
</style>
