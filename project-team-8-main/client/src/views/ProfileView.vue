<script setup>
import { useProfile } from '../controllers/useProfile.js'
import ActionFeedback from '../components/ActionFeedback.vue'
const { user, canSubmit, isAdmin, projects, busy, error, success, form, ready, save } = useProfile()
const headers = [
  { title: 'Project', key: 'name' },
  { title: 'Semester', key: 'semester' },
  { title: 'Status', key: 'approved' },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>
<template>
  <div class="eyebrow mb-3">YOUR CORNER OF THE COMMUNITY</div>
  <h1 class="page-title mb-3">Hello, {{ user?.name }}.</h1>
  <p class="text-medium-emphasis mb-8">Keep your profile up to date and give your work a home.</p>
  <ActionFeedback :error="error" :success="success" />
  <v-card
    v-if="isAdmin"
    border
    class="pa-6 mb-8 d-flex align-center justify-space-between flex-wrap ga-4"
  >
    <div>
      <h2 class="text-h6 mb-2">Review student submissions</h2>
      <p class="text-medium-emphasis">
        Open the admin dashboard to approve submissions and manage community projects.
      </p>
    </div>
    <v-btn to="/admin" color="primary" prepend-icon="mdi-clipboard-check-outline">
      Open review queue
    </v-btn>
  </v-card>
  <v-row>
    <v-col cols="12" md="5">
      <v-card border class="pa-7">
        <h2 class="text-h5 mb-6">My profile</h2>
        <form @submit.prevent="save">
          <v-text-field v-model="form.semester" label="Semester" maxlength="50" />
          <v-textarea v-model="form.interest" label="Interests" rows="3" maxlength="2000" />
          <v-text-field v-model="form.languages" label="Coding languages" maxlength="300" />
          <v-text-field v-model="form.contact" label="Contact details" maxlength="300" />
          <v-btn type="submit" color="primary" :loading="busy" :disabled="!ready">
            Save profile
          </v-btn>
        </form>
      </v-card>
    </v-col>
    <v-col cols="12" md="7">
      <div class="d-flex align-center justify-space-between ga-3 mb-5">
        <h2 class="text-h5">My projects</h2>
        <v-btn v-if="canSubmit" to="/projects/new" color="primary" prepend-icon="mdi-plus">
          New project
        </v-btn>
      </div>
      <v-card border>
        <v-data-table
          :headers="headers"
          :items="projects"
          :loading="busy"
          :items-per-page="5"
          no-data-text="Your projects will appear here after submission."
        >
          <template #item.name="{ item }">
            <router-link :to="`/projects/${item.id}`" class="table-link">
              {{ item.name }}
            </router-link>
          </template>
          <template #item.approved="{ item }">
            <v-chip :color="item.approved ? 'primary' : 'warning'" size="small">
              {{ item.approved ? 'Published' : 'In review' }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              :to="`/projects/${item.id}/edit`"
              icon="mdi-pencil-outline"
              aria-label="Edit project"
              size="small"
              variant="text"
            />
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
