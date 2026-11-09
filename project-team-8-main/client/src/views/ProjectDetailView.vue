<script setup>
import { useProjectDetail } from '../controllers/useProjectDetail.js'
import { useSession } from '../controllers/useSession.js'
import ActionFeedback from '../components/ActionFeedback.vue'
import ProjectPoster from '../components/ProjectPoster.vue'
const { user, isAdmin } = useSession()
const {
  route,
  project,
  comments,
  likes,
  text,
  busy,
  error,
  success,
  like,
  comment,
  removeComment,
} = useProjectDetail()
function date(value) {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString()
}
</script>
<template>
  <v-btn to="/" variant="text" prepend-icon="mdi-arrow-left" class="mb-6">All projects</v-btn>
  <ActionFeedback :error="error" :success="success" />
  <v-progress-linear v-if="busy && !project" indeterminate color="primary" />
  <template v-if="project">
    <div class="eyebrow mb-4">{{ project.semester }} / TEAM {{ project.teamNumber }}</div>
    <div class="d-flex justify-space-between align-start flex-wrap ga-4 mb-5">
      <h1 class="page-title">{{ project.name }}</h1>
      <v-chip v-if="project.winner" color="primary" prepend-icon="mdi-trophy-outline">
        Award winner
      </v-chip>
    </div>
    <p class="text-h6 text-medium-emphasis mb-8">By {{ project.teamName }}</p>
    <v-row>
      <v-col cols="12" md="8">
        <v-card border class="pa-7 mb-6">
          <ProjectPoster :id="project.id" :name="project.name" class="mb-6" />
          <h2 class="text-h5 mb-5">The idea behind it</h2>
          <p class="preserve-lines">{{ project.overview }}</p>
          <div class="d-flex flex-wrap ga-2 mt-6">
            <v-chip
              v-for="language in project.languages.split(',').filter(Boolean)"
              :key="language"
              size="small"
            >
              {{ language.trim() }}
            </v-chip>
          </div>
        </v-card>
        <v-card border class="pa-7">
          <h2 class="text-h5 mb-6">
            The conversation
            <span class="text-medium-emphasis">({{ comments.length }})</span>
          </h2>
          <form v-if="user" @submit.prevent="comment">
            <v-textarea v-model="text" label="Share a thought" rows="3" maxlength="2000" required />
            <v-btn type="submit" color="primary" :loading="busy" class="mb-7">Post comment</v-btn>
          </form>
          <p v-else class="mb-6">
            <router-link :to="{ name: 'login', query: { redirect: route.fullPath } }">
              Sign in
            </router-link>
            to join the conversation.
          </p>
          <div v-for="(entry, index) in comments" :key="entry.id || index" class="comment">
            <div class="d-flex align-center ga-3">
              <strong>{{ entry.name }}</strong>
              <span class="text-caption text-medium-emphasis">{{ date(entry.createdAt) }}</span>
              <v-spacer />
              <v-btn
                v-if="isAdmin && entry.id"
                icon="mdi-delete-outline"
                size="small"
                variant="text"
                aria-label="Delete comment"
                :disabled="busy"
                @click="removeComment(entry.id)"
              />
            </div>
            <p class="preserve-lines mt-2">{{ entry.text }}</p>
          </div>
          <p v-if="!comments.length" class="text-medium-emphasis">
            Start a conversation about this project.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card border class="pa-6">
          <h2 class="text-h6 mb-4">Meet the team</h2>
          <p class="font-weight-bold">{{ project.teamName }}</p>
          <p class="preserve-lines text-medium-emphasis mt-2 mb-6">
            {{ project.members || 'Team details coming soon.' }}
          </p>
          <v-btn
            v-if="project.videoUrl"
            :href="project.videoUrl"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            block
            append-icon="mdi-play-outline"
            class="mb-3"
          >
            Watch the demo
          </v-btn>
          <v-btn
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            block
            prepend-icon="mdi-github"
            class="mb-3"
          >
            Explore the code
          </v-btn>
          <v-btn
            v-if="user"
            block
            variant="tonal"
            color="primary"
            prepend-icon="mdi-heart-outline"
            :loading="busy"
            @click="like"
          >
            Support this project · {{ likes }}
          </v-btn>
          <p v-else class="text-body-2 text-center">
            {{ likes }} supporters ·
            <router-link to="/login">Sign in to support</router-link>
          </p>
          <v-btn
            v-if="isAdmin || user?.id === project.ownerId"
            :to="`/projects/${project.id}/edit`"
            block
            variant="text"
            class="mt-4"
          >
            Edit project
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </template>
</template>
