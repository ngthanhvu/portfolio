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
    title: () => profile.value.name,
})
</script>

<template>
    <div class="relative min-h-screen">
        <GridBackground class="h-full w-full" />

        <!-- Hero -->
        <section class="relative z-20 mx-auto mt-8 w-full max-w-5xl px-4 sm:px-6 md:mt-12 lg:px-8">
            <div class="flex flex-col items-center md:flex-row">
                <div class="relative w-full md:w-1/2">
                    <p class="label-mono mb-5 flex items-center gap-2 text-[11px] text-zinc-500">
                        <span class="text-[9px] leading-none text-sky-400">●</span>
                        PORTFOLIO / V1.0
                    </p>
                    <h1 class="mb-5 text-4xl font-bold uppercase leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
                        Hi, {{ profile.name }}
                    </h1>
                    <p class="label-mono mb-6 border-l-2 border-sky-500/60 pl-3 text-[12px] leading-relaxed text-zinc-300">
                        {{ profile.tagline }}
                    </p>
                    <p class="mb-2 text-[13px] text-zinc-500">
                        {{ profile.bio }}
                    </p>
                    <div class="mt-6 flex items-center gap-2">
                        <a v-for="social in profile.socials" :key="social.name" :href="social.url" target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex h-8 w-8 items-center justify-center border border-zinc-700/80 bg-zinc-900/60 text-zinc-400 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
                            :aria-label="social.name">
                            <Icon :name="social.icon" class="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div
                    class="relative mt-8 flex w-full justify-center md:mt-0 md:w-1/2 md:translate-y-4 md:justify-end xl:translate-y-0">
                    <div class="relative z-30 w-48 max-w-48 sm:w-56 sm:max-w-56 md:w-auto md:max-w-sm">
                        <img :src="profile.avatar" :alt="profile.name"
                            class="aspect-square w-full border border-zinc-700 object-cover" />
                    </div>
                </div>
            </div>
        </section>

        <SectionDivider label="My Writings" />

        <!-- Posts -->
        <section class="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold uppercase leading-10 tracking-tight text-white">
                Posts
            </h2>

            <div class="label-mono mb-2 mt-2 text-[11px] text-zinc-600">
                <span class="text-zinc-300">Categories:</span>
                <a v-for="[category, count] in categories" :key="category" href="#"
                    class="ml-1 inline-block underline underline-offset-4 hover:text-sky-300">
                    {{ category }} ({{ count }}) 、
                </a>
            </div>

            <div class="label-mono mb-6 text-[11px] text-zinc-600">
                <span class="text-zinc-300">Tags:</span>
                <a v-for="[tag, count] in topTags" :key="tag" href="#"
                    class="ml-1 inline-block underline underline-offset-4 hover:text-sky-300">
                    #{{ tag }} ({{ count }}) 、
                </a>
            </div>

            <div class="w-full space-y-7">
                <PostListItem v-for="post in latestPosts" :key="post.id" :post="post" />
            </div>

            <div v-if="latestPosts.length === 0"
                class="flex flex-col items-center border border-dashed border-border py-8 text-center">
                <span class="label-mono text-[11px] text-zinc-600">No posts yet. Check back later!</span>
            </div>

            <div class="flex items-center justify-center py-5">
                <NuxtLink to="/posts"
                    class="label-mono inline-flex border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-[12px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-100 active:bg-sky-500/30">
                    View all posts
                </NuxtLink>
            </div>
        </section>

        <SectionDivider label="My Projects" />

        <!-- Projects -->
        <section class="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold uppercase leading-10 tracking-tight text-white">
                Projects
            </h2>

            <div class="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
                <ProjectCard v-for="project in allProjects" :key="project.id" :project="project" />
            </div>

            <div v-if="allProjects.length === 0"
                class="flex flex-col items-center border border-dashed border-border py-8 text-center">
                <span class="label-mono text-[11px] text-zinc-600">No projects yet. Check back later!</span>
            </div>

            <div class="flex items-center justify-center py-5">
                <NuxtLink to="/projects"
                    class="label-mono inline-flex border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-[12px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-100 active:bg-sky-500/30">
                    View all projects
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
