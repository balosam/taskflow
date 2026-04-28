import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import AddProjectView from '../views/AddProjectView.vue'
import EditProjectView from '../views/EditProjectView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/projects', component: ProjectsView, meta: { requiresAuth: true } },
  { path: '/projects/add', component: AddProjectView, meta: { requiresAuth: true } },
  { path: '/projects/edit/:id', component: EditProjectView, meta: { requiresAuth: true } },
  { path: '/projects/:id', component: ProjectDetailView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('taskflow-token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router