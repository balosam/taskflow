import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('taskflow-user')) || null)
  const token = ref(localStorage.getItem('taskflow-token') || null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (email === 'balo@taskflow.com' && password === 'password123') {
      const userData = {
        id: 1,
        name: 'Balogun Adeniyi',
        email,
        role: 'Admin',
        avatar: 'B'
      }
      const fakeToken = 'taskflow-token-xyz123'

      user.value = userData
      token.value = fakeToken

      localStorage.setItem('taskflow-user', JSON.stringify(userData))
      localStorage.setItem('taskflow-token', fakeToken)

      return { success: true }
    }

    return { success: false, message: 'Invalid email or password' }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('taskflow-user')
    localStorage.removeItem('taskflow-token')
  }

  return { user, token, isLoggedIn, login, logout }
})