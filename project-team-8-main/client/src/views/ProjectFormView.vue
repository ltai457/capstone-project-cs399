<script setup>
import { useProjectForm } from '../controllers/useProjectForm.js'
import ActionFeedback from '../components/ActionFeedback.vue'
const { busy, error, form, editing, ready, submit } = useProjectForm()
</script>
<template>
  <div class="form-page">
    <v-btn to="/profile" variant="text" prepend-icon="mdi-arrow-left" class="mb-6">
      My projects
    </v-btn>
    <div class="eyebrow mb-3">MADE TO BE SHARED</div>
    <h1 class="page-title">{{ editing ? 'Refine your project.' : 'Give your idea a stage.' }}</h1>
    <p class="text-medium-emphasis mb-8">
      {{
        editing
          ? 'Keep your project details up to date.'
          : 'Tell the story behind your work. Student submissions are reviewed before publication.'
      }}
    </p>
    <ActionFeedback :error="error" />
    <v-card border class="pa-7">
      <form @submit.prevent="submit">
        <h2 class="text-h6 mb-5">The project</h2>
        <v-text-field v-model="form.name" label="Project name *" required maxlength="200" />
        <v-textarea
          v-model="form.overview"
          label="Project overview *"
          required
          rows="5"
          maxlength="10000"
        />
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field v-model="form.teamName" label="Team name *" required maxlength="100" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="form.teamNumber"
              label="Team number *"
              type="number"
              min="1"
              step="1"
              required
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="form.members"
          label="Team members"
          hint="Separate names with commas"
        />
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.semester"
              label="Semester *"
              placeholder="2026 S2"
              required
              maxlength="50"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.languages"
              label="Technologies"
              placeholder="JavaScript, Vue, Python"
              maxlength="300"
            />
          </v-col>
        </v-row>
        <template v-if="!editing">
          <h2 class="text-h6 mb-5">Show your work</h2>
          <v-text-field v-model="form.videoUrl" label="Demo video URL *" type="url" required />
          <v-text-field v-model="form.githubUrl" label="Repository URL" type="url" />
          <v-file-input
            :model-value="form.image"
            @update:model-value="form.image = Array.isArray($event) ? $event[0] : $event"
            label="Project poster (PNG, up to 5 MB)"
            accept="image/png"
            variant="outlined"
          />
        </template>
        <div class="d-flex justify-end ga-3 mt-4">
          <v-btn to="/profile" variant="text">Cancel</v-btn>
          <v-btn type="submit" color="primary" size="large" :loading="busy" :disabled="!ready">
            {{ editing ? 'Save changes' : 'Submit project' }}
          </v-btn>
        </div>
      </form>
    </v-card>
  </div>
</template>
