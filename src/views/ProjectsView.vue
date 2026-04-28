<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Projects</h1>
        <p class="subtitle">{{ store.projects.length }} total projects</p>
      </div>
      <RouterLink to="/projects/add" class="add-btn">+ New Project</RouterLink>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Search projects..." />
      <span class="search-icon">⌕</span>
    </div>

    <!-- Filter tabs -->
    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ active: currentFilter === f.value }"
        @click="currentFilter = f.value"
      >
        {{ f.label }}
        <span class="count">{{ filterCount(f.value) }}</span>
      </button>
    </div>

    <div class="loading" v-if="store.loading">
      <div class="spinner"></div>
    </div>

    <div class="projects-grid" v-else>
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @view="router.push(`/projects/${$event}`)"
        @edit="router.push(`/projects/edit/${$event}`)"
        @delete="handleDelete"
      />

      <!-- Empty state -->
      <div class="empty-state" v-if="filteredProjects.length === 0">
        <div class="empty-icon">📋</div>
        <h3>No projects found</h3>
        <p v-if="searchQuery">No results for "{{ searchQuery }}" — try a different search.</p>
        <p v-else>No projects in this category yet.</p>
        <RouterLink to="/projects/add" class="empty-btn" v-if="!searchQuery">
          + Create your first project
        </RouterLink>
      </div>
    </div>

    <!-- Delete modal -->
    <div class="modal-overlay" v-if="projectToDelete" @click.self="projectToDelete = null">
      <div class="modal">
        <h2>Delete project?</h2>
        <p>Are you sure you want to delete <strong>{{ projectToDelete.name }}</strong>? All tasks will also be lost.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="projectToDelete = null">Cancel</button>
          <button class="confirm-btn" @click="confirmDelete" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Yes, delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useToastStore } from '../stores/toast'
import ProjectCard from '../components/ProjectCard.vue'

const router = useRouter()
const store = useProjectsStore()
const toast = useToastStore()

const currentFilter = ref('all')
const searchQuery = ref('')
const projectToDelete = ref(null)
const deleting = ref(false)

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' }
]

onMounted(() => store.fetchProjects())

const filteredProjects = computed(() => {
  let list = store.projects
  if (currentFilter.value !== 'all') {
    list = list.filter(p => p.status === currentFilter.value)
  }
  if (searchQuery.value.trim()) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return list
})

function filterCount(value) {
  if (value === 'all') return store.projects.length
  return store.projects.filter(p => p.status === value).length
}

function handleDelete(project) {
  projectToDelete.value = project
}

async function confirmDelete() {
  deleting.value = true
  await store.deleteProject(projectToDelete.value.id)
  toast.show(`"${projectToDelete.value.name}" deleted`, 'error')
  deleting.value = false
  projectToDelete.value = null
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
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

/* Search */
.search-bar {
  position: relative;
  margin-bottom: 14px;
}

.search-bar input {
  width: 100%;
  padding: 11px 14px 11px 40px;
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.search-bar input:focus { border-color: #42d392; }

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  font-size: 18px;
  pointer-events: none;
}

/* Filters */
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filters button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: 1px solid #1f1f1f;
  border-radius: 20px;
  background: transparent;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filters button:hover { border-color: #42d392; color: #42d392; }
.filters button.active { background: #42d392; color: #0f0f0f; border-color: #42d392; font-weight: 600; }

.count {
  background: rgba(0,0,0,0.2);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
}

.filters button.active .count { background: rgba(0,0,0,0.15); }

/* Loading */
.loading { display: flex; justify-content: center; padding: 60px; }

.spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #1f1f1f;
  border-top-color: #42d392;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* Empty state */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: #111;
  border: 1px dashed #1f1f1f;
  border-radius: 16px;
  text-align: center;
}

.empty-icon { font-size: 48px; margin-bottom: 16px; }

.empty-state h3 {
  font-size: 18px;
  margin: 0 0 8px;
  color: #ddd;
}

.empty-state p {
  font-size: 14px;
  color: #555;
  margin: 0 0 20px;
}

.empty-btn {
  padding: 10px 24px;
  background: #42d39218;
  border: 1px solid #42d39244;
  color: #42d392;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.empty-btn:hover { background: #42d39230; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
}

.modal h2 { font-size: 18px; margin: 0 0 10px; }
.modal p { color: #888; font-size: 14px; margin: 0 0 24px; line-height: 1.6; }
.modal strong { color: white; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

.cancel-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #888;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  padding: 10px 20px;
  background: #ff4d4d;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>