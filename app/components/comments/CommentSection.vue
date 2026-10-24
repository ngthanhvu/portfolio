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
        <div class="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 class="label-mono text-[11px] text-zinc-300">
                {{ commentCount }} comments
            </h2>
            <button v-if="currentUser" class="label-mono text-[11px] text-zinc-600 hover:text-zinc-100"
                @click="handleLogout">
                Logout
            </button>
        </div>

        <!-- Composer: always visible once auth state is known -->
        <div v-if="authChecked" class="mb-6 flex gap-3">
            <img v-if="currentUser" :src="currentUserAvatar" :alt="currentUser.name"
                class="h-10 w-10 shrink-0 border border-zinc-800 object-cover" />
            <div v-else
                class="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-800 bg-zinc-950 text-zinc-500">
                <Icon name="lucide:message-circle" class="h-5 w-5" />
            </div>

            <div class="flex-1">
                <textarea v-model="newComment" rows="3" placeholder="Join the discussion…"
                    class="w-full resize-none border border-zinc-800 bg-black px-4 py-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400"
                    @keydown.enter="onComposerEnter" />

                <div class="mt-3 flex items-center justify-between gap-3">
                    <span class="label-mono text-[11px] text-zinc-600">
                        <template v-if="currentUser">
                            Commenting as
                            <span class="text-zinc-300">{{ currentUser.name }}</span>
                        </template>
                        <template v-else>Login to join the discussion.</template>
                    </span>

                    <button v-if="currentUser" type="button" :disabled="!newComment.trim()"
                        class="label-mono inline-flex items-center border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-[11px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200 active:bg-sky-500/30 disabled:pointer-events-none disabled:opacity-40"
                        @click="handleSubmit">
                        Comment
                    </button>
                    <button v-else type="button"
                        class="label-mono inline-flex items-center gap-2 border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-[11px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200 active:bg-sky-500/30"
                        @click="openAuthDialog">
                        <Icon name="lucide:log-in" class="h-4 w-4" />
                        Login to comment
                    </button>
                </div>

                <p v-if="commentError" class="label-mono mt-2 text-[11px] text-red-400">
                    {{ commentError }}
                </p>
            </div>
        </div>

        <!-- Loading auth state -->
        <div v-else class="label-mono mb-6 flex items-center gap-2 text-[11px] text-zinc-600">
            <Icon name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
            Loading…
        </div>

        <div class="label-mono mb-6 flex items-center justify-end gap-4 text-[11px]">
            <button class="cursor-pointer transition-colors duration-150"
                :class="sort === 'best' ? 'text-sky-300 underline decoration-2 underline-offset-4' : 'text-zinc-500 hover:text-zinc-100'"
                @click="sort = 'best'">
                Best
            </button>
            <button class="cursor-pointer transition-colors duration-150"
                :class="sort === 'newest' ? 'text-sky-300 underline decoration-2 underline-offset-4' : 'text-zinc-500 hover:text-zinc-100'"
                @click="sort = 'newest'">
                Newest
            </button>
            <button class="cursor-pointer transition-colors duration-150"
                :class="sort === 'oldest' ? 'text-sky-300 underline decoration-2 underline-offset-4' : 'text-zinc-500 hover:text-zinc-100'"
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
                    <div class="absolute inset-0 bg-black/70" @click="closeAuthDialog" />
                    <div
                        class="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden border border-zinc-700 bg-zinc-950">
                        <div class="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                            <h3 class="label-mono text-[11px] text-zinc-300">
                                {{ authMode === 'login' ? 'Login' : 'Create account' }}
                            </h3>
                            <button type="button" class="text-zinc-500 transition-colors hover:text-zinc-100"
                                aria-label="Close" @click="closeAuthDialog">
                                <Icon name="lucide:x" class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="mb-4 flex border border-zinc-800">
                                <button type="button"
                                    class="label-mono flex-1 py-1.5 text-[11px] transition-colors duration-150"
                                    :class="authMode === 'login' ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'text-zinc-500 hover:text-zinc-100'"
                                    @click="authMode = 'login'">
                                    Login
                                </button>
                                <button type="button"
                                    class="label-mono flex-1 border-l border-zinc-800 py-1.5 text-[11px] transition-colors duration-150"
                                    :class="authMode === 'register' ? 'border-sky-500/40 bg-sky-500/10 text-sky-300' : 'text-zinc-500 hover:text-zinc-100'"
                                    @click="authMode = 'register'">
                                    Register
                                </button>
                            </div>

                            <p class="label-mono mb-3 text-[11px] text-zinc-600">
                                {{
                                    authMode === 'login' ? 'Login to join the discussion.' :
                                        'Create an account to comment.'
                                }}
                            </p>

                            <form class="space-y-3" @submit.prevent="handleAuth">
                                <input v-if="authMode === 'register'" v-model="authForm.name" type="text"
                                    placeholder="Name" required
                                    class="flex h-10 w-full border border-zinc-800 bg-black px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400">
                                <input ref="emailInput" v-model="authForm.email" type="email" placeholder="Email"
                                    required
                                    class="flex h-10 w-full border border-zinc-800 bg-black px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400">
                                <input v-model="authForm.password" type="password" placeholder="Password" required
                                    class="flex h-10 w-full border border-zinc-800 bg-black px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400">

                                <p v-if="authError" class="label-mono flex items-center gap-2 text-[11px] text-red-400">
                                    <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
                                    {{ authError }}
                                </p>

                                <button type="submit" :disabled="authLoading"
                                    class="label-mono inline-flex h-10 w-full items-center justify-center gap-2 border border-sky-500/40 bg-sky-500/10 px-4 text-[12px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200 active:bg-sky-500/30 disabled:pointer-events-none disabled:opacity-40">
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
                    <div class="absolute inset-0 bg-black/70" @click="closeShareDialog" />
                    <div
                        class="relative w-full max-w-md border border-zinc-700 bg-zinc-950 p-6">
                        <div class="mb-4 flex items-center justify-between">
                            <h3 class="label-mono text-[11px] text-zinc-300">
                                Share comment
                            </h3>
                            <button type="button" class="text-zinc-500 transition-colors hover:text-zinc-100"
                                aria-label="Close" @click="closeShareDialog">
                                <Icon name="lucide:x" class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="flex items-center gap-2">
                            <input :value="shareUrl" readonly
                                class="label-mono flex-1 border border-zinc-800 bg-black px-3 py-2 text-[12px] text-zinc-200 outline-none focus:border-zinc-400" />
                            <button type="button"
                                class="label-mono inline-flex items-center gap-2 border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-[11px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200 active:bg-sky-500/30"
                                @click="copyShareUrl">
                                <Icon name="lucide:copy" class="h-4 w-4" />
                                {{ shareCopied ? 'Copied' : 'Copy' }}
                            </button>
                        </div>

                        <div class="mt-4 flex items-center justify-center gap-4">
                            <button type="button"
                                class="label-mono flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-900/60 text-zinc-300 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
                                aria-label="Share on Facebook" @click="shareTo('facebook')">
                                <Icon name="lucide:facebook" class="h-5 w-5" />
                            </button>
                            <button type="button"
                                class="label-mono flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-900/60 text-zinc-300 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
                                aria-label="Share on X" @click="shareTo('twitter')">
                                <Icon name="lucide:twitter" class="h-5 w-5" />
                            </button>
                            <button type="button"
                                class="label-mono flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-900/60 text-zinc-300 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
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
