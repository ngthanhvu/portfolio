<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
    error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode ?? 500)

const title = computed(() => {
    if (statusCode.value === 404) return 'Page not found'
    if (statusCode.value === 403) return 'Access denied'
    if (statusCode.value >= 500) return 'Server error'
    return 'An error occurred'
})

const description = computed(() => {
    if (statusCode.value === 404) {
        return 'The page you are looking for does not exist or has been moved to another address.'
    }
    if (statusCode.value === 403) {
        return 'You do not have permission to access this page. Please log in or contact the administrator.'
    }
    if (statusCode.value >= 500) {
        return 'A server-side issue occurred. Please try again in a few minutes.'
    }
    return props.error?.message || 'An unexpected issue occurred. Please try again.'
})

useHead(() => ({
    title: `${statusCode.value} - ${title.value}`,
}))

function goHome() {
    clearError({ redirect: '/' })
}
</script>

<template>
    <section class="flex min-h-screen items-center bg-black">
        <div class="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6 lg:py-16">
            <div class="mx-auto max-w-screen-sm text-center">
                <h1 class="mb-6 text-7xl font-extrabold leading-none tabular-nums tracking-tighter text-white lg:text-9xl">
                    {{ statusCode }}
                </h1>
                <p class="label-mono mb-4 text-[12px] text-sky-300">
                    // {{ title }}
                </p>
                <p class="label-mono mb-8 text-[11px] leading-relaxed text-zinc-500">
                    {{ description }}
                </p>
                <button type="button"
                    class="label-mono inline-flex border border-sky-500/40 bg-sky-500/10 px-6 py-2.5 text-[12px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-100 active:bg-sky-500/30"
                    @click="goHome">
                    Back to Home
                </button>
            </div>
        </div>
    </section>
</template>
