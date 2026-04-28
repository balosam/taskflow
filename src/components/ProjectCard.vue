<template>
  <div class="project-card">
    <div class="card-header">
      <div class="card-icon" :style="{ background: statusColor(project.status) + '22', color: statusColor(project.status) }">
        {{ project.name.charAt(0) }}
      </div>
      <div class="card-badges">
        <span class="status-badge" :class="project.status">{{ project.status }}</span>
        <span class="priority-badge" :class="project.priority">{{ project.priority }}</span>
      </div>
    </div>

    <h2>{{ project.name }}</h2>
    <p class="card-desc">{{ project.description }}</p>

    <!-- Progress bar -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Progress</span>
        <span class="progress-percent">{{ progress }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progress + '%' }"
          :class="{ complete: progress === 100 }"
        ></div>
      </div>
    </div>

    <p class="card-date">Created {{ project.createdAt }}</p>

    <div class="card-actions">
      <button class="view-btn" @click="emit('view', project.id)">View Tasks</button>
      <button class="edit-btn" @click="emit('edit', project.id)">Edit</button>
      <button class="delete-btn" @click="emit('delete', project)">Delete</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects'

const props = defineProps({
  project: { type: Object, required: true }
})

const emit = defineEmits(['view', 'edit', 'delete'])
const store = useProjectsStore()
const progress = ref(0)

onMounted(async () => {
  progress.value = await store.fetchProjectProgress(props.project.id)
})

function statusColor(status) {
  const map = { 'todo': '#f59e0b', 'in-progress': '#4d9ef5', 'completed': '#42d392' }
  return map[status] || '#888'
}
</script>

<style scoped>
.project-card {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s, transform 0.2s;
}

.project-card:hover {
  border-color: #2a2a2a;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.card-badges { display: flex; gap: 6px; }

.status-badge, .priority-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: capitalize;
}

.status-badge.todo { background: #f59e0b22; color: #f59e0b; }
.status-badge.in-progress { background: #4d9ef522; color: #4d9ef5; }
.status-badge.completed { background: #42d39222; color: #42d392; }
.priority-badge.high { background: #ff4d4d22; color: #ff4d4d; }
.priority-badge.medium { background: #f59e0b22; color: #f59e0b; }
.priority-badge.low { background: #88888822; color: #888; }

.project-card h2 { font-size: 15px; font-weight: 600; margin: 0; }

.card-desc {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* Progress bar */
.progress-section { display: flex; flex-direction: column; gap: 6px; }

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label { font-size: 11px; color: #555; }
.progress-percent { font-size: 11px; color: #888; font-weight: 600; }

.progress-bar {
  height: 5px;
  background: #1f1f1f;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4d9ef5;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-fill.complete { background: #42d392; }

.card-date { font-size: 11px; color: #333; margin: 0; }

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.view-btn {
  flex: 1;
  padding: 8px;
  background: #42d39218;
  border: 1px solid #42d39233;
  color: #42d392;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover { background: #42d39230; }

.edit-btn {
  padding: 8px 14px;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  background: transparent;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover { border-color: #42d392; color: #42d392; }

.delete-btn {
  padding: 8px 14px;
  border: 1px solid #ff4d4d33;
  border-radius: 8px;
  background: transparent;
  color: #ff4d4d;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover { background: #ff4d4d18; }
</style>