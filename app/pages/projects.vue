<script setup lang="ts">
const { allProjects, fetchProjects } = useProjects()

onMounted(() => {
  fetchProjects()
})

useHead({
  title: 'Projects | Portfolio',
})
</script>

<template>
  <div class="min-h-screen">
    <div class="border-b border-border bg-background py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-4xl text-center">
          <Badge class="mb-4">Projects</Badge>
          <h1 class="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            My Projects
          </h1>
          <p class="text-lg text-muted-foreground">
            A collection of things I have built and contributed to.
          </p>
        </div>
      </div>
    </div>

    <section class="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="project in allProjects" :key="project.id" :project="project" />
        </div>
      </div>
    </section>
  </div>
</template>
