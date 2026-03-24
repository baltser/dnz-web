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

      <div v-if="logResult" class="log-result">
        <button @click="logResult = null" class="close-log">×</button>
        <pre>{{ logResult }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Entrance {
  id: number
  name_entrance: string
  port: number
  address: { address: string; ip_address: string }
  password?: { decrypted_password: string }
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
const logResult = ref<string | null>(null)

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
  logResult.value = null
  
  try {
    const result = await $fetch<ApiResponse>(`/api/address/entrance/${entrance.value.id}/log0.asp`)
    if (result.success) {
      logResult.value = result.raw
    } else {
      logResult.value = `Ошибка: ${result.error}`
    }
  } catch (err: any) {
    logResult.value = `Ошибка запроса: ${err.message}`
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

.log-result {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;
  margin-top: 2rem;
}

.close-log {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #666;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
}

.close-log:hover {
  background: #d32f2f;
}

.log-result pre {
  margin: 0;
  padding: 2rem 1.5rem 1.5rem;
  background: #1a1a1a;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  max-height: 500px;
  overflow-y: auto;
  border-radius: 12px;
  white-space: pre-wrap;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .main { margin: 1rem auto; padding: 0 1rem; }
  .address { padding: 1.5rem; }
}
</style>
