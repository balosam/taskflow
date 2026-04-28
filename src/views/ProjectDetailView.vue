<template>
  <div>

    <div class="loading-page" v-if="pageLoading">
      <div class="spinner"></div>
    </div>

    <template v-else-if="project">
      <div class="page-header">
        <div class="header-left">
          <RouterLink to="/projects" class="back">← Projects</RouterLink>
          <div class="title-row">
            <h1>{{ project.name }}</h1>
            <span class="status-badge" :class="project.status">{{ project.status }}</span>
            <span class="priority-badge" :class="project.priority">{{ project.priority }}</span>
          </div>
          <p class="desc">{{ project.description }}</p>
        </div>
        <RouterLink :to="`/projects/edit/${project.id}`" class="edit-btn">Edit Project</RouterLink>
      </div>

      <div class="task-stats">
        <div class="task-stat">
          <span class="ts-value">{{ taskStore.tasks.length }}</span>
          <span class="ts-label">Total tasks</span>
        </div>
        <div class="task-stat">
          <span class="ts-value todo">{{ taskCount('todo') }}</span>
          <span class="ts-label">Todo</span>
        </div>
        <div class="task-stat">
          <span class="ts-value inprogress">{{ taskCount('in-progress') }}</span>
          <span class="ts-label">In Progress</span>
        </div>
        <div class="task-stat">
          <span class="ts-value done">{{ taskCount('completed') }}</span>
          <span class="ts-label">Completed</span>
        </div>
      </div>

      <div class="add-task-form">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Add a new task..."
          @keyup.enter="handleAddTask"
        />
        <select v-model="newTaskPriority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button @click="handleAddTask" :disabled="!newTaskTitle.trim()">
          Add Task
        </button>
      </div>

      <div class="task-filters">
        <button
          v-for="f in taskFilters"
          :key="f.value"
          :class="{ active: taskFilter === f.value }"
          @click="taskFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="tasks-list" v-if="!taskStore.loading">

        <div
          class="task-item"
          v-for="task in filteredTasks"
          :key="task.id"
          :class="{ completed: task.status === 'completed' }"
        >
          <div class="task-left">
            <button
              class="task-check"
              :class="{ checked: task.status === 'completed' }"
              @click="cycleStatus(task)"
              :title="task.status"
            >
              {{ task.status === 'completed' ? '✓' : task.status === 'in-progress' ? '◑' : '○' }}
            </button>
            <div>
              <p class="task-title">{{ task.title }}</p>
              <span class="task-status-label" :class="task.status">{{ task.status }}</span>
            </div>
          </div>
          <div class="task-right">
            <span class="task-priority" :class="task.priority">{{ task.priority }}</span>
            <button class="task-delete" @click="handleDeleteTask(task.id)">✕</button>
          </div>
        </div>

        <!-- Empty state for tasks -->
        <div class="empty-tasks" v-if="filteredTasks.length === 0">
          <span class="empty-icon">✅</span>
          <p v-if="taskFilter === 'all'">No tasks yet. Add your first task above!</p>
          <p v-else>No {{ taskFilter }} tasks. Try a different filter.</p>
        </div>

      </div>

      <div class="loading-tasks" v-else>
        <div class="spinner"></div>
      </div>
    </template>

    <div v-else class="not-found">
      <p>Project not found.</p>
      <RouterLink to="/projects">← Back to Projects</RouterLink>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useTasksStore } from '../stores/tasks'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const projectStore = useProjectsStore()
const taskStore = useTasksStore()
const toast = useToastStore()

const project = ref(null)
const pageLoading = ref(true)
const newTaskTitle = ref('')
const newTaskPriority = ref('medium')
const taskFilter = ref('all')

const taskFilters = [
  { label: 'All', value: 'all' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' }
]

onMounted(async () => {
  const id = route.params.id
  project.value = await projectStore.fetchProject(id)
  await taskStore.fetchTasksByProject(id)
  pageLoading.value = false
})

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return taskStore.tasks
  return taskStore.tasks.filter(t => t.status === taskFilter.value)
})

function taskCount(status) {
  return taskStore.tasks.filter(t => t.status === status).length
}

async function handleAddTask() {
  if (!newTaskTitle.value.trim()) return
  await taskStore.addTask({
    projectId: Number(route.params.id),
    title: newTaskTitle.value.trim(),
    status: 'todo',
    priority: newTaskPriority.value
  })
  toast.show('Task added successfully', 'success')
  newTaskTitle.value = ''
}

async function cycleStatus(task) {
  const next = {
    'todo': 'in-progress',
    'in-progress': 'completed',
    'completed': 'todo'
  }
  await taskStore.updateTaskStatus(task.id, next[task.status])
  toast.show(`Task moved to ${next[task.status]}`, 'info')
}

async function handleDeleteTask(id) {
  await taskStore.deleteTask(id)
  toast.show('Task deleted', 'error')
}
</script>

<style scoped>
.loading-page {
  display: flex;
  justify-content: center;
  padding: 80px;
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 20px;
}

.back {
  display: inline-block;
  color: #555;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 10px;
  transition: color 0.2s;
}

.back:hover { color: #42d392; }

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

h1 { font-size: 24px; margin: 0; }
.desc { color: #666; font-size: 14px; margin: 0; }

.edit-btn {
  padding: 9px 18px;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  color: #888;
  text-decoration: none;
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s;
}

.edit-btn:hover { border-color: #42d392; color: #42d392; }

.status-badge, .priority-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: capitalize;
}

.status-badge.todo { background: #f59e0b22; color: #f59e0b; }
.status-badge.in-progress { background: #4d9ef522; color: #4d9ef5; }
.status-badge.completed { background: #42d39222; color: #42d392; }
.priority-badge.high { background: #ff4d4d22; color: #ff4d4d; }
.priority-badge.medium { background: #f59e0b22; color: #f59e0b; }
.priority-badge.low { background: #88888822; color: #888; }

.task-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.task-stat {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 10px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  text-align: center;
}

.ts-value { font-size: 28px; font-weight: 700; color: #ddd; }
.ts-value.todo { color: #f59e0b; }
.ts-value.inprogress { color: #4d9ef5; }
.ts-value.done { color: #42d392; }
.ts-label { font-size: 12px; color: #555; }

.add-task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-task-form input {
  flex: 1;
  padding: 11px 14px;
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.add-task-form input:focus { border-color: #42d392; }

.add-task-form select {
  padding: 11px 14px;
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.add-task-form select option { background: #111; }

.add-task-form button {
  padding: 11px 20px;
  background: #42d392;
  color: #0f0f0f;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.add-task-form button:hover { background: #36b37e; }
.add-task-form button:disabled { opacity: 0.4; cursor: not-allowed; }

.task-filters {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.task-filters button {
  padding: 5px 14px;
  border: 1px solid #1f1f1f;
  border-radius: 20px;
  background: transparent;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.task-filters button:hover { border-color: #42d392; color: #42d392; }
.task-filters button.active { background: #42d392; color: #0f0f0f; border-color: #42d392; font-weight: 600; }

.tasks-list {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  overflow: hidden;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #1a1a1a;
  transition: background 0.15s;
  gap: 12px;
}

.task-item:last-child { border-bottom: none; }
.task-item:hover { background: #161616; }
.task-item.completed .task-title { text-decoration: line-through; opacity: 0.4; }

.task-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.task-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #2a2a2a;
  background: transparent;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.task-check:hover { border-color: #42d392; color: #42d392; }
.task-check.checked { background: #42d39222; border-color: #42d392; color: #42d392; }

.task-title {
  font-size: 14px;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-status-label {
  font-size: 11px;
  text-transform: capitalize;
}

.task-status-label.todo { color: #f59e0b; }
.task-status-label.in-progress { color: #4d9ef5; }
.task-status-label.completed { color: #42d392; }

.task-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.task-priority {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: capitalize;
}

.task-priority.high { background: #ff4d4d22; color: #ff4d4d; }
.task-priority.medium { background: #f59e0b22; color: #f59e0b; }
.task-priority.low { background: #88888822; color: #888; }

.task-delete {
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

.task-delete:hover { background: #ff4d4d18; color: #ff4d4d; }

/* Empty state for tasks */
.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  gap: 10px;
}

.empty-icon { font-size: 36px; }

.empty-tasks p {
  color: #444;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.loading-tasks { display: flex; justify-content: center; padding: 40px; }

.not-found {
  text-align: center;
  color: #888;
  padding: 80px;
}

.not-found a {
  color: #42d392;
  text-decoration: none;
  display: block;
  margin-top: 12px;
}
</style>