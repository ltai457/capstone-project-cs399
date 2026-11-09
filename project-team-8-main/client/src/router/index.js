import { createRouter, createWebHashHistory } from 'vue-router'
import { session } from '../data/session.js'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    {
      path: '/projects/new',
      name: 'submit',
      component: () => import('../views/ProjectFormView.vue'),
      meta: { roles: ['Admin', 'Student'] },
    },
    {
      path: '/projects/:id/edit',
      name: 'edit',
      component: () => import('../views/ProjectFormView.vue'),
      meta: { roles: ['Admin', 'Student'] },
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: () => import('../views/ProjectDetailView.vue'),
    },
    { path: '/login', name: 'login', component: () => import('../views/AuthView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/AuthView.vue') },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { auth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { roles: ['Admin'] },
    },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const user = session.get()
  if ((to.meta.auth || to.meta.roles) && !user)
    return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.roles && !to.meta.roles.includes(user.role)) return { name: 'projects' }
})

// A 401 or sign-out also removes protected content already on screen.
session.subscribe((user) => {
  if (!user && (router.currentRoute.value.meta.auth || router.currentRoute.value.meta.roles)) {
    router.push({ name: 'login' })
  }
})
export default router
