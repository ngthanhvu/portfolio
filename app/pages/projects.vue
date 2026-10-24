<script setup lang="ts">
const { allProjects } = useProjects()

useHead({
  title: 'Projects | Portfolio',
})
</script>

<template>
  <div class="min-h-screen">
    <div class="relative border-b border-border bg-background py-12 md:py-16">
      <GridBackground />
      <div class="relative z-20 mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <Badge class="mb-4">Projects</Badge>
          <h1 class="mb-4 text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            My Projects
          </h1>
          <p class="label-mono text-[11px] text-zinc-500 md:text-xs">
            A collection of things I have built and contributed to.
          </p>
        </div>
      </div>
    </div>

    <section class="mx-auto w-full px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div class="mx-auto min-w-0 max-w-6xl">
        <div class="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="project in allProjects" :key="project.id" :project="project" />
        </div>

        <div v-if="allProjects.length === 0"
          class="flex flex-col items-center border border-dashed border-border py-12 text-center">
          <span class="label-mono text-[11px] text-zinc-600">No projects yet. Check back later!</span>
        </div>
      </div>
    </section>
  </div>
</template>
