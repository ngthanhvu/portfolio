<script setup lang="ts">
const { profile } = useProfile()
const { allPosts } = usePosts()
const { allProjects } = useProjects()

const latestPosts = computed(() => allPosts.value.slice(0, 5))

const categories = computed(() => {
    const map = new Map<string, number>()
    allPosts.value.forEach((post) => {
        map.set(post.category, (map.get(post.category) || 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
})

const topTags = computed(() => {
    const map = new Map<string, number>()
    allPosts.value.forEach((post) => {
        post.tags.forEach((tag) => {
            map.set(tag, (map.get(tag) || 0) + 1)
        })
    })
    return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
})

useHead({
    title: profile.value.name,
})
</script>

<template>
    <div class="relative">
        <GridBackground />

        <!-- Hero -->
        <section class="relative z-20 mx-auto mt-8 w-full max-w-5xl px-7 md:mt-12 xl:px-0">
            <div class="flex flex-col items-center md:flex-row">
                <div class="relative w-full md:w-1/2">
                    <h1 class="mb-5 text-4xl font-bold leading-tight text-neutral-900 md:text-5xl lg:text-6xl">
                        Hi, {{ profile.name }}
                    </h1>
                    <p class="mb-6 text-base font-semibold text-neutral-800">
                        {{ profile.tagline }}
                    </p>
                    <p class="mb-2 text-neutral-600">
                        {{ profile.bio }}
                    </p>
                    <div class="mt-6 flex items-center gap-5">
                        <a v-for="social in profile.socials" :key="social.name" :href="social.url" target="_blank"
                            rel="noopener noreferrer"
                            class="inline-block h-5 w-5 text-neutral-700 transition-opacity hover:opacity-70"
                            :aria-label="social.name">
                            <Icon :name="social.icon" class="h-full w-full" />
                        </a>
                    </div>
                </div>

                <div
                    class="relative mt-10 w-full md:mt-0 md:flex md:w-1/2 md:translate-y-4 md:justify-end xl:translate-y-0">
                    <div class="relative z-30 max-w-xs md:max-w-sm">
                        <img :src="profile.avatar" :alt="profile.name"
                            class="aspect-square w-full rounded-3xl object-cover" />
                    </div>
                </div>
            </div>
        </section>

        <SectionDivider label="My Writings" />

        <!-- Posts -->
        <section class="relative z-20 mx-auto max-w-5xl px-7 lg:px-0">
            <h2 class="text-2xl font-bold leading-10 tracking-tight text-neutral-900">
                Posts
            </h2>

            <div class="mb-2 mt-2 text-sm text-neutral-600">
                <span class="font-medium">Categories:</span>
                <a v-for="[category, count] in categories" :key="category" href="#"
                    class="ml-1 inline-block hover:underline decoration-dashed underline-offset-4">
                    {{ category }} ({{ count }}) 、
                </a>
            </div>

            <div class="mb-6 text-sm text-neutral-600">
                <span class="font-medium">Tags:</span>
                <a v-for="[tag, count] in topTags" :key="tag" href="#"
                    class="ml-1 inline-block hover:underline decoration-dashed underline-offset-4">
                    #{{ tag }} ({{ count }}) 、
                </a>
            </div>

            <div class="w-full space-y-7">
                <PostListItem v-for="post in latestPosts" :key="post.id" :post="post" />
            </div>

            <div class="flex items-center justify-center py-5">
                <NuxtLink to="/posts"
                    class="inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-100 transition-all duration-300 ease-out hover:bg-white hover:text-neutral-900">
                    View all posts
                </NuxtLink>
            </div>
        </section>

        <SectionDivider label="My Projects" />

        <!-- Projects -->
        <section class="relative z-20 mx-auto max-w-5xl px-7 lg:px-0">
            <h2 class="text-2xl font-bold leading-10 tracking-tight text-neutral-900">
                Projects
            </h2>

            <div class="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
                <ProjectCard v-for="project in allProjects" :key="project.id" :project="project" />
            </div>

            <div class="flex items-center justify-center py-5">
                <NuxtLink to="/projects"
                    class="inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-100 transition-all duration-300 ease-out hover:bg-white hover:text-neutral-900">
                    View all projects
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
