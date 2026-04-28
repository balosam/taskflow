<template>
  <div class="app">
    <div class="layout" v-if="authStore.isLoggedIn">

      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-icon">⚡</span>
          <span>TaskFlow</span>
        </div>

        <p class="nav-section-label">MENU</p>

        <nav class="sidebar-nav">
          <RouterLink to="/dashboard" class="nav-item">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </span>
            Dashboard
          </RouterLink>

          <RouterLink to="/projects" class="nav-item">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            Projects
          </RouterLink>

          <RouterLink to="/projects/add" class="nav-item">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </span>
            New Project
          </RouterLink>
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">{{ authStore.user?.name?.charAt(0) }}</div>
          <div class="user-info">
            <p class="user-name">{{ authStore.user?.name }}</p>
            <p class="user-role">{{ authStore.user?.role }}</p>
          </div>
          <button class="logout-btn" @click="handleLogout" title="Logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <RouterView v-else />

    <ToastNotification />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import ToastNotification from './components/ToastNotification.vue'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: sans-serif;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #111;
  border-right: 1px solid #1f1f1f;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  box-sizing: border-box;
  padding: 24px 0 20px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 20px;
  font-size: 18px;
  font-weight: 700;
  color: #42d392;
  flex-shrink: 0;
}

.logo-icon { font-size: 20px; }

.nav-section-label {
  font-size: 10px;
  color: #333;
  letter-spacing: 1.5px;
  padding: 0 20px 8px;
  margin: 0;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 10px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #888;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.nav-item:hover { background: #1a1a1a; color: white; }

.nav-item.router-link-active {
  background: #42d39218;
  color: #42d392;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-user {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 10px;
  padding: 12px;
  border-top: 1px solid #1f1f1f;
  border-radius: 8px;
  background: #0f0f0f;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #42d39222;
  color: #42d392;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 11px;
  font-weight: 500;
  margin: 0 0 1px;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 10px;
  color: #444;
  margin: 0;
}

.logout-btn {
  background: transparent;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover { color: #ff4d4d; }

.main-content {
  margin-left: 240px;
  flex: 1;
  padding: 40px;
  min-height: 100vh;
  background: #0a0a0a;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>