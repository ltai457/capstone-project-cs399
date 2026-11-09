<script setup>
import { useAuth } from '../controllers/useAuth.js'
import ActionFeedback from '../components/ActionFeedback.vue'
const { busy, error, route, registering, form, submit } = useAuth()
</script>
<template>
  <div class="narrow-page">
    <div class="eyebrow mb-4">YOUR NEXT CHAPTER</div>
    <h1 class="page-title">{{ registering ? 'Join the makers.' : 'Welcome back.' }}</h1>
    <p class="text-medium-emphasis mb-8">
      {{
        registering
          ? 'Share your work and be part of the capstone community.'
          : 'Sign in to share, discover, and connect.'
      }}
    </p>
    <v-card border class="pa-7">
      <ActionFeedback :error="error" />
      <form @submit.prevent="submit">
        <v-text-field
          v-if="registering"
          v-model="form.name"
          label="Your name"
          autocomplete="name"
          required
          maxlength="100"
        />
        <v-text-field
          v-model="form.email"
          label="Email address"
          type="email"
          autocomplete="email"
          required
          maxlength="254"
        />
        <v-text-field
          v-model="form.password"
          label="Password"
          type="password"
          :autocomplete="registering ? 'new-password' : 'current-password'"
          :minlength="registering ? 8 : undefined"
          required
        />
        <v-select
          v-if="registering"
          v-model="form.roleId"
          :items="[
            { title: 'Student', value: 2 },
            { title: 'Visitor', value: 3 },
          ]"
          label="I am a…"
        />
        <v-btn type="submit" color="primary" size="large" block :loading="busy">
          {{ registering ? 'Create account' : 'Sign in' }}
        </v-btn>
      </form>
      <p class="mt-6 text-center text-body-2">
        {{ registering ? 'Already part of the community?' : 'New to Democraft?' }}
        <router-link :to="{ name: registering ? 'login' : 'register', query: route.query }">
          {{ registering ? 'Sign in' : 'Create an account' }}
        </router-link>
      </p>
    </v-card>
  </div>
</template>
