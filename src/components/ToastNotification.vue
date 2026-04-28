<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
        >
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="remove(toast.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '../stores/toast'
const toastStore = useToastStore()
const toasts = toastStore.toasts
const remove = toastStore.remove

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-family: sans-serif;
  min-width: 260px;
  max-width: 360px;
  pointer-events: all;
  border: 1px solid transparent;
}

.toast.success {
  background: #0f1f18;
  border-color: #42d39244;
  color: #42d392;
}

.toast.error {
  background: #1f0f0f;
  border-color: #ff4d4d44;
  color: #ff4d4d;
}

.toast.info {
  background: #0f1520;
  border-color: #4d9ef544;
  color: #4d9ef5;
}

.toast-icon { font-weight: 700; font-size: 13px; flex-shrink: 0; }
.toast-msg { flex: 1; line-height: 1.4; }

.toast-close {
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  flex-shrink: 0;
}

.toast-close:hover { opacity: 1; }

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>