import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/projects')
      projects.value = res.data
    } catch {
      error.value = 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id) {
    try {
      const res = await api.get(`/projects/${id}`)
      return res.data
    } catch {
      return null
    }
  }

  async function addProject(data) {
    try {
      const res = await api.post('/projects', {
        ...data,
        createdAt: new Date().toISOString().split('T')[0]
      })
      projects.value.push(res.data)
      return { success: true, project: res.data }
    } catch {
      return { success: false, message: 'Failed to add project' }
    }
  }

  async function updateProject(id, data) {
    try {
      const res = await api.put(`/projects/${id}`, data)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) projects.value[index] = res.data
      return { success: true }
    } catch {
      return { success: false, message: 'Failed to update project' }
    }
  }

  async function deleteProject(id) {
    try {
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter(p => p.id !== id)
      return { success: true }
    } catch {
      return { success: false, message: 'Failed to delete project' }
    }
  }

  async function fetchProjectProgress(projectId) {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`)
      const tasks = res.data
      if (tasks.length === 0) return 0
      const completed = tasks.filter(t => t.status === 'completed').length
      return Math.round((completed / tasks.length) * 100)
    } catch {
      return 0
    }
  }

  return {
    projects, loading, error,
    fetchProjects, fetchProject,
    addProject, updateProject, deleteProject,
    fetchProjectProgress
  }
})