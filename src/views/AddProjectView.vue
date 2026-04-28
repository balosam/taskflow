<template>
  <div class="form-page">
    <div class="form-card">
      <RouterLink to="/projects" class="back">← Back to Projects</RouterLink>
      <h1>New Project</h1>
      <p class="subtitle">Add a new project to your workspace</p>

      <div class="field" :class="{ invalid: errors.name }">
        <label>Project Name</label>
        <input v-model="form.name" type="text" placeholder="e.g. E-commerce App" />
        <span class="error-msg" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="field" :class="{ invalid: errors.description }">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="What is this project about?" rows="3"></textarea>
        <span class="error-msg" v-if="errors.description">{{ errors.description }}</span>
      </div>

      <div class="row">
        <div class="field" :class="{ invalid: errors.status }">
          <label>Status</label>
          <select v-model="form.status">
            <option value="">Select status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <span class="error-msg" v-if="errors.status">{{ errors.status }}</span>
        </div>

        <div class="field" :class="{ invalid: errors.priority }">
          <label>Priority</label>
          <select v-model="form.priority">
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <span class="error-msg" v-if="errors.priority">{{ errors.priority }}</span>
        </div>
      </div>

      <div class="api-error" v-if="apiError">{{ apiError }}</div>

      <button class="submit-btn" @click="handleSubmit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Project' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const store = useProjectsStore()
const toast = useToastStore()

const form = ref({ name: '', description: '', status: '', priority: '' })
const errors = ref({ name: '', description: '', status: '', priority: '' })
const apiError = ref('')
const loading = ref(false)

function validate() {
  errors.value.name = !form.value.name.trim() ? 'Project name is required' : ''
  errors.value.description = !form.value.description.trim() ? 'Description is required' : ''
  errors.value.status = !form.value.status ? 'Please select a status' : ''
  errors.value.priority = !form.value.priority ? 'Please select a priority' : ''
  return Object.values(errors.value).every(e => e === '')
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  const result = await store.addProject({
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    status: form.value.status,
    priority: form.value.priority
  })
  loading.value = false
  if (result.success) {
    toast.show('Project created successfully!', 'success')
    router.push('/projects')
  } else {
    apiError.value = result.message
  }
}
</script>

<style scoped>
.form-page { display: flex; justify-content: center; }

.form-card {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
}

.back {
  display: inline-block;
  color: #888;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back:hover { color: #42d392; }

h1 { font-size: 22px; margin: 0 0 6px; }
.subtitle { color: #888; font-size: 14px; margin: 0 0 28px; }

.field {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

label { font-size: 13px; color: #aaa; }

input, select, textarea {
  padding: 11px 14px;
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-family: sans-serif;
}

textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { border-color: #42d392; }
select option { background: #111; }
.field.invalid input,
.field.invalid select,
.field.invalid textarea { border-color: #ff4d4d; }
.error-msg { font-size: 12px; color: #ff4d4d; }

.api-error {
  background: #ff4d4d18;
  border: 1px solid #ff4d4d33;
  border-radius: 8px;
  padding: 12px;
  color: #ff4d4d;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 13px;
  background: #42d392;
  color: #0f0f0f;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.submit-btn:hover { background: #36b37e; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>