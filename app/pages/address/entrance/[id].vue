<template>
  <div class="simple-entrance">
    <header class="header">
      <button @click="goBack" class="back-btn">← Назад</button>
      <h1>Подъезд {{ entrance?.name_entrance }}</h1>
    </header>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
    <div v-else-if="!entrance" class="no-data">Подъезд не найден</div>

    <main v-else class="main">
      <div class="address">
        <strong>{{ entrance.address.address }}</strong>
        <div>IP: {{ entrance.address.ip_address }} | Порт: {{ entrance.port }}</div>
      </div>

      <button 
        @click="fetchLog" 
        :disabled="loadingLog"
        class="fetch-btn"
      >
        {{ loadingLog ? '⏳ Загрузка...' : '📋 Получить лог панели' }}
      </button>
    </main>

    <!-- Модалка с логом -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        <pre class="modal-pre">{{ modalText }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Entrance {
  id: number
  name_entrance: string
  port: number
  password?: {
    id: number
    decrypted_password: string
  } | null
  address: {
    id: number
    address: string
    ip_address?: string | null
  }
}

interface ApiResponse {
  success: boolean
  raw: string
  error?: string
}

const route = useRoute()
const router = useRouter()

const entrance = ref<Entrance | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadingLog = ref(false)

// состояние модалки
const isModalOpen = ref(false)
const modalText = ref('')

const showModal = computed(() => isModalOpen.value && !!modalText.value)

const openModal = (text: string) => {
  modalText.value = text
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  modalText.value = ''
}

const fetchEntrance = async (id: string) => {
  try {
    entrance.value = await $fetch<Entrance>(`/api/address/entrance/${id}`)
  } catch (err) {
    error.value = 'Не удалось загрузить подъезд'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchLog = async () => {
  if (!entrance.value) return
  loadingLog.value = true

  try {
    const result = await $fetch<ApiResponse>(`/api/address/entrance/${entrance.value.id}/log0.asp`)
    if (result.success) {
      openModal(result.raw)
    } else {
      openModal(`Ошибка: ${result.error}`)
    }
  } catch (err: any) {
    openModal(`Ошибка запроса: ${err?.message || 'Неизвестная ошибка'}`)
  } finally {
    loadingLog.value = false
  }
}

const goBack = () => router.back()

onMounted(() => {
  fetchEntrance(route.params.id as string)
})
</script>

<style scoped>
.simple-entrance {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: system-ui, sans-serif;
}

.header {
  background: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.back-btn:hover {
  background: #1565c0;
}

.header h1 {
  margin: 0;
  font-size: 1.3rem;
  flex: 1;
}

.loading, .error, .no-data {
  padding: 3rem 1.5rem;
  text-align: center;
  font-size: 1.1rem;
}

.error { color: #d32f2f; }
.no-data { color: #666; }

.main {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.address {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  margin-bottom: 2rem;
}

.address strong {
  display: block;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.address div {
  color: #666;
  font-size: 1rem;
}

.fetch-btn {
  width: 100%;
  padding: 1.2rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.fetch-btn:hover:not(:disabled) {
  background: #1976d2;
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
}

.fetch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Модалка */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  width: 600px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f0f0f0;
  color: #000;
}

.modal-pre {
  margin: 0;
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
  background: #1a1a1a;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  white-space: pre-wrap;
}
</style>