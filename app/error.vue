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
    <section class="bg-white min-h-screen flex items-center">
        <div class="py-8 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6 w-full">
            <div class="mx-auto max-w-screen-sm text-center">
                <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
                    {{ statusCode }}
                </h1>
                <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
                    {{ title }}
                </p>
                <p class="mb-4 text-lg font-light text-gray-500">
                    {{ description }}
                </p>
                <button type="button" @click="goHome"
                    class="cursor-pointer px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                    Back to Home
                </button>
            </div>
        </div>
    </section>
</template>
