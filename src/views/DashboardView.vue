<template>
  <div>
    <div class="page-header">
  <div>
    <p class="greeting-text">{{ greeting }}, {{ firstName }} 👋</p>
    <h1>Dashboard</h1>
    <p class="subtitle">Here's what's happening with your projects</p>
  </div>
  <RouterLink to="/projects/add" class="add-btn">+ New Project</RouterLink>
</div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <p class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Recent projects -->
    <div class="section">
      <h2>Recent Projects</h2>

      <div class="loading" v-if="store.loading">
        <div class="spinner"></div>
      </div>

      <div class="projects-list" v-else>
        <div
          class="project-row"
          v-for="project in recentProjects"
          :key="project.id"
          @click="router.push(`/projects/${project.id}`)"
        >
          <div class="project-left">
            <div class="project-icon" :style="{ background: statusColor(project.status) + '22', color: statusColor(project.status) }">
              {{ project.name.charAt(0) }}
            </div>
            <div>
              <p class="project-name">{{ project.name }}</p>
              <p class="project-desc">{{ project.description }}</p>
            </div>
          </div>
          <div class="project-right">
            <span class="status-badge" :class="project.status">{{ project.status }}</span>
            <span class="priority-badge" :class="project.priority">{{ project.priority }}</span>
          </div>
        </div>

        <p class="empty" v-if="store.projects.length === 0">
          No projects yet. <RouterLink to="/projects/add">Create your first one →</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const store = useProjectsStore()
const authStore = useAuthStore()

onMounted(() => store.fetchProjects())

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => {
  return authStore.user?.name?.split(' ')[0] || 'there'
})

const recentProjects = computed(() => store.projects.slice(0, 5))

const stats = computed(() => [
  { label: 'Total Projects', value: store.projects.length, color: '#42d392' },
  { label: 'In Progress', value: store.projects.filter(p => p.status === 'in-progress').length, color: '#4d9ef5' },
  { label: 'Completed', value: store.projects.filter(p => p.status === 'completed').length, color: '#a78bfa' },
  { label: 'Todo', value: store.projects.filter(p => p.status === 'todo').length, color: '#f59e0b' }
])

function statusColor(status) {
  const map = { 'todo': '#f59e0b', 'in-progress': '#4d9ef5', 'completed': '#42d392' }
  return map[status] || '#888'
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

h1 { font-size: 28px; margin: 0 0 4px; }
.subtitle { color: #888; font-size: 14px; margin: 0; }

.add-btn {
  padding: 10px 20px;
  background: #42d392;
  color: #0f0f0f;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.add-btn:hover { background: #36b37e; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 24px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 6px;
}

.stat-label {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.section h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #ddd;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #1f1f1f;
  border-top-color: #42d392;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.projects-list {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  overflow: hidden;
}

.project-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #1a1a1a;
  cursor: pointer;
  transition: background 0.15s;
  gap: 16px;
}

.project-row:last-child { border-bottom: none; }
.project-row:hover { background: #161616; }

.project-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.project-name {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 3px;
}

.project-desc {
  font-size: 12px;
  color: #555;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.project-right {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.status-badge, .priority-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: capitalize;
}

.greeting-text {
  font-size: 14px;
  color: #42d392;
  margin: 0 0 4px;
  font-weight: 500;
}

.status-badge.todo { background: #f59e0b22; color: #f59e0b; }
.status-badge.in-progress { background: #4d9ef522; color: #4d9ef5; }
.status-badge.completed { background: #42d39222; color: #42d392; }
.priority-badge.high { background: #ff4d4d22; color: #ff4d4d; }
.priority-badge.medium { background: #f59e0b22; color: #f59e0b; }
.priority-badge.low { background: #88888822; color: #888; }

.empty {
  padding: 48px;
  text-align: center;
  color: #555;
  font-size: 14px;
}

.empty a { color: #42d392; text-decoration: none; }
</style>