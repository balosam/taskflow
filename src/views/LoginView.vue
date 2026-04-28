<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand">
        <span class="brand-icon">⚡</span>
        <span class="brand-name">TaskFlow</span>
      </div>
      <h1>Manage your projects<br/>with clarity.</h1>
      <p>Track tasks, monitor progress, and ship faster — all in one place.</p>

      <div class="features">
        <div class="feature" v-for="f in features" :key="f">
          <span class="check">✓</span> {{ f }}
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-card">
        <h2>Welcome back</h2>
        <p class="subtitle">Sign in to your TaskFlow account</p>

        <div class="hint">
          <strong>Demo login:</strong> balo@taskflow.com / password123
        </div>

        <div class="field" :class="{ invalid: errors.email }">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="your@email.com" @keyup.enter="handleLogin" />
          <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="field" :class="{ invalid: errors.password }">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" @keyup.enter="handleLogin" />
          <span class="error-msg" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="api-error" v-if="apiError">{{ apiError }}</div>

        <button class="login-btn" @click="handleLogin" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const features = [
  'Organise projects in one place',
  'Track tasks by status and priority',
  'Clean dashboard with live stats'
]

const form = ref({ email: '', password: '' })
const errors = ref({ email: '', password: '' })
const apiError = ref('')
const loading = ref(false)

function validate() {
  errors.value.email = !form.value.email ? 'Email is required' : ''
  errors.value.password = !form.value.password ? 'Password is required' : ''
  return !errors.value.email && !errors.value.password
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  apiError.value = ''
  const result = await authStore.login(form.value.email, form.value.password)
  loading.value = false
  if (result.success) {
    router.push('/dashboard')
  } else {
    apiError.value = result.message
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: sans-serif;
}

.login-left {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #0f0f0f;
  border-right: 1px solid #1f1f1f;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 48px;
}

.brand-icon { font-size: 24px; }
.brand-name { font-size: 20px; font-weight: 700; color: #42d392; }

.login-left h1 {
  font-size: 40px;
  line-height: 1.2;
  margin: 0 0 16px;
}

.login-left p {
  color: #888;
  font-size: 16px;
  line-height: 1.7;
  margin: 0 0 40px;
  max-width: 400px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #aaa;
  font-size: 15px;
}

.check {
  color: #42d392;
  font-weight: 700;
}

.login-right {
  width: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
}

.login-card h2 { font-size: 26px; margin: 0 0 6px; }

.subtitle { color: #888; font-size: 14px; margin: 0 0 24px; }

.hint {
  background: #42d39211;
  border: 1px solid #42d39233;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #888;
  margin-bottom: 24px;
  line-height: 1.7;
}

.hint strong { color: #42d392; }

.field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label { font-size: 13px; color: #aaa; }

input {
  padding: 12px 14px;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus { border-color: #42d392; }
.field.invalid input { border-color: #ff4d4d; }
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

.login-btn {
  width: 100%;
  padding: 14px;
  background: #42d392;
  color: #0f0f0f;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.login-btn:hover { background: #36b37e; }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>