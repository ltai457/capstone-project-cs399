<script setup>
import { useRouter } from 'vue-router'
import { useSession } from './controllers/useSession.js'
const { user, isAdmin, canSubmit, logout } = useSession()
const router = useRouter()
function signOut() {
  logout()
  router.push('/')
}
</script>

<template>
  <v-app>
    <v-app-bar flat color="background" height="80" class="app-header">
      <v-container class="d-flex align-center ga-3 py-0">
        <router-link to="/" class="brand" aria-label="Democraft home">
          <span class="brand-mark">d.</span>
          democraft
          <span class="brand-dot">.</span>
        </router-link>
        <v-spacer />
        <v-btn to="/" variant="text" class="desktop-nav">Explore</v-btn>
        <v-btn to="/about" variant="text" class="desktop-nav">About</v-btn>
        <v-btn v-if="isAdmin" to="/admin" variant="text">Admin</v-btn>
        <v-btn
          v-if="canSubmit"
          to="/projects/new"
          color="primary"
          prepend-icon="mdi-plus"
          class="desktop-nav"
        >
          Share a project
        </v-btn>
        <v-menu v-if="user">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="tonal"
              color="primary"
              icon="mdi-account-outline"
              aria-label="Account menu"
            />
          </template>
          <v-list min-width="220">
            <v-list-item :title="user.name" :subtitle="user.role" />
            <v-list-item
              v-if="isAdmin"
              to="/admin"
              title="Admin dashboard"
              prepend-icon="mdi-clipboard-check-outline"
            />
            <v-list-item
              to="/profile"
              title="My profile & projects"
              prepend-icon="mdi-account-outline"
            />
            <v-list-item
              v-if="canSubmit"
              to="/projects/new"
              title="Share a project"
              prepend-icon="mdi-plus"
            />
            <v-list-item title="Sign out" prepend-icon="mdi-logout" @click="signOut" />
          </v-list>
        </v-menu>
        <v-btn v-else to="/login" color="primary" variant="outlined">
          Sign in
          <v-icon end>mdi-arrow-top-right</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container class="page-container"><router-view :key="$route.fullPath" /></v-container>
    </v-main>
    <footer class="site-footer">
      <v-container class="d-flex flex-wrap justify-space-between ga-3">
        <span class="font-weight-bold">democraft.</span>
        <span>Built by students. Shared with everyone.</span>
        <router-link to="/about">University of Auckland · Capstone</router-link>
      </v-container>
    </footer>
  </v-app>
</template>
