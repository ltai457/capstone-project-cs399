<script setup>
defineProps({ project: { type: Object, required: true } })
</script>
<template>
  <v-card :to="`/projects/${project.id}`" class="project-card h-100" border>
    <div class="project-cover" :class="`cover-${project.id % 4}`" aria-hidden="true">
      <span class="cover-code">
        {{ String(project.teamNumber || project.id).padStart(2, '0') }}
      </span>
      <span class="cover-title">{{ project.name }}</span>
      <v-chip
        v-if="project.winner"
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-trophy-outline"
        class="award-chip"
      >
        Award winner
      </v-chip>
    </div>
    <v-card-text class="pa-6">
      <div class="eyebrow mb-3">
        {{ project.semester }}
        <span class="mx-2">/</span>
        {{ project.teamName }}
      </div>
      <h2 class="card-title mb-3">
        {{ project.name }}
        <v-icon size="20">mdi-arrow-top-right</v-icon>
      </h2>
      <p class="project-summary">{{ project.overview }}</p>
      <div class="d-flex flex-wrap ga-2 mt-5">
        <v-chip
          v-for="language in project.languages
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean)
            .slice(0, 3)"
          :key="language"
          size="small"
          variant="tonal"
        >
          {{ language }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>
