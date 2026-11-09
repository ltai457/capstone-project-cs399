<script setup>
import { onMounted, ref } from 'vue'
import { useProjects } from '../controllers/useProjects.js'
import ProjectCard from '../components/ProjectCard.vue'
import ActionFeedback from '../components/ActionFeedback.vue'
const {
  projects,
  filtered,
  search,
  semester,
  semesters,
  winnersOnly,
  busy,
  error,
  load,
  clearFilters,
} = useProjects()
const display = ref('grid')
const headers = [
  { title: 'Project', key: 'name' },
  { title: 'Team', key: 'teamName' },
  { title: 'Semester', key: 'semester' },
  { title: 'Technologies', key: 'languages' },
  { title: 'Recognition', key: 'winner' },
]
onMounted(load)
function explore() {
  document.getElementById('collection')?.scrollIntoView()
}
</script>

<template>
  <section class="hero">
    <div class="hero-copy">
      <div class="eyebrow mb-6">
        <span class="live-dot" />
        THE CAPSTONE COLLECTION
      </div>
      <h1>
        Big ideas.
        <br />
        Built into
        <em>reality.</em>
      </h1>
      <p class="hero-description">
        A new generation of makers, thinkers, and problem solvers. Explore what University of
        Auckland students are building.
      </p>
      <v-btn color="primary" size="large" append-icon="mdi-arrow-down" @click="explore">
        Explore the projects
      </v-btn>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="art-orbit orbit-one" />
      <div class="art-orbit orbit-two" />
      <div class="art-note note-back">const idea = possibility</div>
      <div class="art-tile">
        <span class="eyebrow">FROM CONCEPT TO CODE</span>
        <div class="art-symbol">&lt; / &gt;</div>
        <div class="d-flex justify-space-between">
          <span>Made of curiosity.</span>
          <v-icon>mdi-arrow-top-right</v-icon>
        </div>
      </div>
      <div class="art-note note-front">
        <span class="live-dot" />
        Student built. Future ready.
      </div>
    </div>
  </section>
  <section id="collection" class="collection">
    <div class="d-flex align-end justify-space-between flex-wrap ga-4 mb-7">
      <div>
        <div class="eyebrow mb-2">EXPLORE THE POSSIBILITIES</div>
        <h2 class="section-title">
          The project collection
          <span class="text-medium-emphasis">({{ projects.length }})</span>
        </h2>
      </div>
      <v-btn-toggle
        v-model="display"
        mandatory
        divided
        variant="outlined"
        density="comfortable"
        color="primary"
        aria-label="Display mode"
      >
        <v-btn value="grid" icon="mdi-view-grid-outline" aria-label="Grid view" />
        <v-btn value="table" icon="mdi-format-list-bulleted" aria-label="Table view" />
      </v-btn-toggle>
    </div>
    <div class="filter-bar">
      <v-text-field
        v-model="search"
        label="Search projects, teams, technologies…"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
      />
      <v-select
        v-model="semester"
        :items="semesters"
        label="All semesters"
        clearable
        hide-details
      />
      <v-checkbox v-model="winnersOnly" label="Award winners" hide-details color="primary" />
    </div>
    <ActionFeedback :error="error" />
    <div v-if="error" class="mb-5"><v-btn variant="outlined" @click="load">Try again</v-btn></div>
    <v-progress-linear v-if="busy" indeterminate color="primary" aria-label="Loading projects" />
    <v-row v-else-if="display === 'grid' && filtered.length">
      <v-col v-for="project in filtered" :key="project.id" cols="12" sm="6" lg="4">
        <ProjectCard :project="project" />
      </v-col>
    </v-row>
    <v-card v-else-if="display === 'table'" border>
      <v-data-table :headers="headers" :items="filtered" :loading="busy" :items-per-page="10" hover>
        <template #item.name="{ item }">
          <router-link :to="`/projects/${item.id}`" class="table-link">{{ item.name }}</router-link>
        </template>
        <template #item.winner="{ item }">
          <v-chip v-if="item.winner" size="small" color="primary">Award winner</v-chip>
          <span v-else>—</span>
        </template>
      </v-data-table>
    </v-card>
    <div v-else-if="!error" class="empty-state">
      <v-icon size="40" color="primary">mdi-folder-search-outline</v-icon>
      <h3 class="mt-4">
        {{ projects.length ? 'No matching projects' : 'The next big idea starts here' }}
      </h3>
      <p>
        {{
          projects.length
            ? 'Try another search or semester.'
            : 'Published projects will appear here once approved.'
        }}
      </p>
      <v-btn v-if="projects.length" variant="text" @click="clearFilters">Clear filters</v-btn>
    </div>
  </section>
</template>
