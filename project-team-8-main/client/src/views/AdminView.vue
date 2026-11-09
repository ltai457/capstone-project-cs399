<script setup>
import { useAdmin } from '../controllers/useAdmin.js'
import { useSession } from '../controllers/useSession.js'
import ActionFeedback from '../components/ActionFeedback.vue'
const { user } = useSession()
const {
  busy,
  error,
  success,
  tab,
  search,
  pending,
  published,
  users,
  confirmation,
  rows,
  approve,
  award,
  askRemoveProject,
  askRemoveUser,
  confirm,
} = useAdmin()
const projectHeaders = [
  { title: 'Project', key: 'name' },
  { title: 'Team', key: 'teamName' },
  { title: 'Semester', key: 'semester' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]
const userHeaders = [
  { title: 'Name', key: 'userName' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'roleID' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]
</script>
<template>
  <div class="eyebrow mb-3">COMMUNITY WORKSPACE</div>
  <h1 class="page-title mb-3">Make great work visible.</h1>
  <p class="text-medium-emphasis mb-8">
    Review submissions, celebrate projects, and manage the community.
  </p>
  <ActionFeedback :error="error" :success="success" />
  <v-row class="mb-6">
    <v-col
      v-for="stat in [
        { label: 'Awaiting review', value: pending.length },
        { label: 'Published projects', value: published.length },
        { label: 'Community members', value: users.length },
      ]"
      :key="stat.label"
      cols="12"
      sm="4"
    >
      <v-card border class="pa-6">
        <div class="eyebrow mb-3">{{ stat.label }}</div>
        <div class="text-h3 font-weight-bold">{{ stat.value }}</div>
      </v-card>
    </v-col>
  </v-row>
  <v-card border>
    <v-tabs v-model="tab" color="primary">
      <v-tab value="pending">Review queue</v-tab>
      <v-tab value="published">Projects</v-tab>
      <v-tab value="users">Members</v-tab>
    </v-tabs>
    <v-divider />
    <div class="pa-5">
      <v-text-field
        v-model="search"
        label="Search this table"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
      />
    </div>
    <v-data-table
      v-if="tab !== 'users'"
      :headers="projectHeaders"
      :items="rows"
      :search="search || ''"
      :loading="busy"
      :items-per-page="10"
    >
      <template #item.name="{ item }">
        <router-link :to="`/projects/${item.id}`" class="table-link">{{ item.name }}</router-link>
        <v-icon v-if="item.winner" size="18" color="primary" class="ml-2">
          mdi-trophy-outline
        </v-icon>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex justify-end ga-1">
          <v-btn
            v-if="tab === 'pending'"
            icon="mdi-check"
            size="small"
            color="primary"
            variant="flat"
            width="40"
            min-width="40"
            height="36"
            aria-label="Approve project"
            title="Approve project"
            :disabled="busy"
            @click="approve(item)"
          />
          <v-btn v-else size="small" variant="tonal" :disabled="busy" @click="award(item)">
            {{ item.winner ? 'Remove award' : 'Award' }}
          </v-btn>
          <v-btn
            :to="`/projects/${item.id}/edit`"
            icon="mdi-pencil-outline"
            size="small"
            variant="text"
            aria-label="Edit project"
          />
          <v-btn
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            color="error"
            :disabled="busy"
            :aria-label="tab === 'pending' ? 'Decline submission' : 'Delete project'"
            @click="askRemoveProject(item)"
          />
        </div>
      </template>
    </v-data-table>
    <v-data-table
      v-else
      :headers="userHeaders"
      :items="users"
      :search="search || ''"
      :loading="busy"
      :items-per-page="10"
    >
      <template #item.roleID="{ item }">
        <v-chip size="small">
          {{ { 1: 'Admin', 2: 'Student', 3: 'Visitor' }[item.roleID] || 'Member' }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-delete-outline"
          size="small"
          variant="text"
          color="error"
          aria-label="Delete member"
          :disabled="busy || item.userID === user?.id"
          @click="askRemoveUser(item)"
        />
      </template>
    </v-data-table>
  </v-card>
  <v-dialog
    :model-value="Boolean(confirmation)"
    @update:model-value="!$event && (confirmation = null)"
    max-width="460"
  >
    <v-card v-if="confirmation" class="pa-6" :title="confirmation.title">
      <v-card-text>{{ confirmation.description }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="confirmation = null">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirm">Confirm deletion</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
