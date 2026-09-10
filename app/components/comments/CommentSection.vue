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
const showAuthDialog = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)
const turnstileToken = ref('')
const turnstileRef = ref<{ reset: () => void } | null>(null)

const turnstileEnabled = !!useRuntimeConfig().public.turnstile?.siteKey

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
    if (!open) {
        turnstileToken.value = ''
        turnstileRef.value?.reset()
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

    if (turnstileEnabled && !turnstileToken.value) {
        authError.value = 'Please complete the captcha verification.'
        return
    }

    authLoading.value = true

    try {
        const url = authMode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
        const body: Record<string, any> = authMode.value === 'login'
            ? { email: authForm.email, password: authForm.password }
            : { name: authForm.name, email: authForm.email, password: authForm.password }

        if (turnstileEnabled) {
            body['cf-turnstile-response'] = turnstileToken.value
        }

        currentUser.value = await $fetch<CurrentUser>(url, { method: 'POST', body })
        authForm.name = ''
        authForm.email = ''
        authForm.password = ''
        showAuthDialog.value = false
        turnstileToken.value = ''
        turnstileRef.value?.reset()

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
    <section class="mx-auto w-full max-w-3xl py-6 text-foreground">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">
                {{ commentCount }} comments
            </h2>
            <button v-if="currentUser" class="text-sm text-muted-foreground hover:text-foreground" @click="handleLogout">
                Logout
            </button>
        </div>

        <!-- Composer: always visible once auth state is known -->
        <div v-if="authChecked" class="mb-6 flex gap-3">
            <img
                v-if="currentUser"
                :src="currentUserAvatar"
                :alt="currentUser.name"
                class="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div
                v-else
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
            >
                <Icon name="lucide:message-circle" class="h-5 w-5" />
            </div>

            <div class="flex-1">
                <textarea
                    v-model="newComment"
                    rows="3"
                    placeholder="Join the discussion…"
                    class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    @keydown.enter="onComposerEnter"
                />

                <div class="mt-3 flex items-center justify-between gap-3">
                    <span class="text-sm text-muted-foreground">
                        <template v-if="currentUser">
                            Commenting as
                            <span class="font-medium text-foreground">{{ currentUser.name }}</span>
                        </template>
                        <template v-else>Login to join the discussion.</template>
                    </span>

                    <button
                        v-if="currentUser"
                        type="button"
                        :disabled="!newComment.trim()"
                        class="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                        @click="handleSubmit"
                    >
                        Comment
                    </button>
                    <button
                        v-else
                        type="button"
                        class="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                        @click="openAuthDialog"
                    >
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
            <button
                class="font-medium transition-colors"
                :class="sort === 'best' ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                @click="sort = 'best'"
            >
                Best
            </button>
            <button
                class="font-medium transition-colors"
                :class="sort === 'newest' ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                @click="sort = 'newest'"
            >
                Newest
            </button>
            <button
                class="font-medium transition-colors"
                :class="sort === 'oldest' ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'"
                @click="sort = 'oldest'"
            >
                Oldest
            </button>
        </div>

        <div class="space-y-6">
            <CommentItem
                v-for="comment in sortedComments"
                :key="comment.id"
                :comment="comment"
                @like="handleLike"
                @dislike="handleDislike"
                @reply="handleReply"
                @share="handleShare"
            />
        </div>

        <!-- Auth dialog -->
        <Teleport to="body">
            <Transition name="auth">
                <div
                    v-if="showAuthDialog"
                    class="fixed inset-0 z-[60] flex items-center justify-center p-4"
                >
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeAuthDialog" />
                    <div class="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                        <div class="flex items-center justify-between border-b border-border px-6 py-4">
                            <h3 class="text-base font-semibold text-foreground">
                                {{ authMode === 'login' ? 'Login' : 'Create account' }}
                            </h3>
                            <button
                                type="button"
                                class="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Close"
                                @click="closeAuthDialog"
                            >
                                <Icon name="lucide:x" class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="mb-4 flex gap-1 rounded-md bg-muted p-1">
                                <button
                                    type="button"
                                    class="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors"
                                    :class="authMode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                                    @click="authMode = 'login'"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    class="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors"
                                    :class="authMode === 'register' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
                                    @click="authMode = 'register'"
                                >
                                    Register
                                </button>
                            </div>

                            <p class="mb-3 text-sm text-muted-foreground">
                                {{ authMode === 'login' ? 'Login to join the discussion.' : 'Create an account to comment.' }}
                            </p>

                            <form class="space-y-3" @submit.prevent="handleAuth">
                                <input
                                    v-if="authMode === 'register'"
                                    v-model="authForm.name"
                                    type="text"
                                    placeholder="Name"
                                    required
                                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                <input
                                    ref="emailInput"
                                    v-model="authForm.email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                <input
                                    v-model="authForm.password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >

                                <NuxtTurnstile
                                    v-if="turnstileEnabled"
                                    ref="turnstileRef"
                                    v-model="turnstileToken"
                                    class="flex justify-center"
                                />

                                <p v-if="authError" class="flex items-center gap-2 text-sm text-red-600">
                                    <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
                                    {{ authError }}
                                </p>

                                <button
                                    type="submit"
                                    :disabled="authLoading || (turnstileEnabled && !turnstileToken)"
                                    class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Icon v-if="authLoading" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
                                    {{ authLoading ? 'Please wait…' : (authMode === 'login' ? 'Login' : 'Create account') }}
                                </button>
                            </form>
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
</style>
