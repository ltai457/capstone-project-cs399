<script setup>
defineProps({ error: String, success: String })
</script>
<template>
  <v-alert v-if="error" type="error" variant="tonal" class="mb-5" role="alert">{{ error }}</v-alert>
  <v-alert v-if="success" type="success" variant="tonal" class="mb-5" role="status">
    {{ success }}
  </v-alert>
</template>
