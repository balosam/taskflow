import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)

  async function fetchTasksByProject(projectId) {
    loading.value = true
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`)
      tasks.value = res.data
    } catch {
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  async function addTask(data) {
    try {
      const res = await api.post('/tasks', data)
      tasks.value.push(res.data)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  async function updateTaskStatus(id, status) {
    try {
      const task = tasks.value.find(t => t.id === id)
      if (!task) return
      const res = await api.put(`/tasks/${id}`, { ...task, status })
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) tasks.value[index] = res.data
    } catch {
      console.error('Failed to update task')
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch {
      console.error('Failed to delete task')
    }
  }

  return {
    tasks, loading,
    fetchTasksByProject, addTask,
    updateTaskStatus, deleteTask
  }
})