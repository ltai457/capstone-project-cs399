<script setup>
import { ref } from 'vue'
defineProps({ id: [Number, String], name: String })
const failed = ref(false)
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
</script>
<template>
  <v-img
    v-if="!failed"
    :src="`${apiBase}/api/Projects/GetProjectImage/${id}`"
    :alt="`${name} project poster`"
    max-height="480"
    rounded="lg"
    @error="failed = true"
  />
</template>
