<template>
  <div class="page-add-address">
    <h1>Добавить адрес</h1>

    <form class="address-form" @submit.prevent="submitForm">
      <!-- Основная форма -->
      <div class="form-step">
        <div class="form-row">
          <label for="address">📍 Текстовый адрес</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            class="form-input"
            placeholder="Улица, дом, корпус..."
            required
          />
        </div>

      <div class="form-row">
        <label for="ip">🌐 IP-адрес или домен</label>
        <input
          id="ip"
          v-model="form.ipAddress"
          type="text"
          class="form-input"
          placeholder="192.168.0.1 или example.com"
          :class="{ 'error': !isValidIP }"
          required
        />
        <small v-if="!isValidIP && form.ipAddress" class="error-text">
          Введите корректный IP (192.168.0.1) или домен (example.com)
        </small>
        <small v-else-if="form.ipAddress" class="valid-text">
          ✅ Корректный адрес
        </small>
      </div>

        <!-- Список подъездов -->
        <div class="form-row">
          <label>🏢 Подъезды</label>
          <div class="entrances-list">
            <div 
              v-for="(entrance, index) in form.entrances" 
              :key="index"
              class="entrance-item"
            >
              <span>{{form.address}} {{entrance.name  }} {{ form.ipAddress }}:{{ entrance.port }}</span>
              <span v-if="entrance.password" class="password-badge">***</span>
              <button 
                type="button" 
                class="btn-remove"
                @click="removeEntrance(index)"
              >
                ×
              </button>
            </div>
            <p v-if="!form.entrances.length" class="empty-state">
              Подъезды не добавлены
            </p>
          </div>
          <button 
            type="button" 
            class="btn-add-entrance"
            @click="showEntranceModal = true"
          >
            + Добавить подъезд
          </button>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!isFormValid"
          >
            Сохранить адрес
          </button>
          <NuxtLink to="/" class="btn btn-secondary">
            Отмена
          </NuxtLink>
        </div>
      </div>
    </form>

    <!-- Модалка для подъезда -->
    <div v-if="showEntranceModal" class="modal-overlay" @click="showEntranceModal = false">
      <div class="modal" @click.stop>
        <h3>Добавить подъезд</h3>
        <div class="form-row">
          <label>Название</label>
          <input
            v-model="newEntrance.name"
            type="text"
            class="form-input"
            placeholder="1 или Центральный"
          />
        </div>
        <div class="form-row">
          <label>Порт</label>
          <input
            v-model.number="newEntrance.port"
            type="number"
            class="form-input"
            placeholder="9000"
            min="1"
            max="65535"
          />
        </div>
        <div class="form-row">
          <label>Пароль (опционально)</label>
          <input
            v-model="newEntrance.password"
            type="text"
            class="form-input"
            placeholder="***"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showEntranceModal = false">
            Отмена
          </button>
          <button 
            class="btn btn-primary"
            @click="addEntrance"
            :disabled="!isNewEntranceValid"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Entrance {
  name: string
  port: number
  password: string
}

interface FormData {
  address: string
  ipAddress: string
  entrances: Entrance[]
}

const form = ref<FormData>({
  address: '',
  ipAddress: '',
  entrances: []
})

const showEntranceModal = ref(false)
const newEntrance = ref({
  name: '',
  port: 0,
  password: ''
})

const authStore = useAuthStore()
// ✅ Проверка авторизации
const isAuthenticated = computed(() => !!authStore.user)

// ✅ НОВАЯ ВАЛИДАЦИЯ: IPv4 ИЛИ домен
const isValidIP = computed(() => {
  const ipOrDomain = form.value.ipAddress.trim()
  if (!ipOrDomain) return false
  
  // IPv4: 192.168.0.1
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  
  // Домен: example.com или sub.domain.co.uk
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$|^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}\.[a-zA-Z]{2,}$/
  
  // Проверяем IPv4 ИЛИ домен
  return ipv4Regex.test(ipOrDomain) || domainRegex.test(ipOrDomain)
})

const isNewEntranceValid = computed(() => {
  return newEntrance.value.name.trim() && newEntrance.value.port > 0
})

const isFormValid = computed(() => {
  return form.value.address.trim() && 
         isValidIP.value && 
         form.value.entrances.length > 0 &&
         isAuthenticated.value  
})

const addEntrance = () => {
  form.value.entrances.push({
    name: newEntrance.value.name.trim(),
    port: newEntrance.value.port,
    password: newEntrance.value.password || ''
  })
  newEntrance.value = { name: '', port: 0, password: '' }
  showEntranceModal.value = false
}

const removeEntrance = (index: number) => {
  form.value.entrances.splice(index, 1)
}

const submitForm = async () => {
  if (!isFormValid.value) return
  
  const payload = {
    address: form.value.address.trim(),
    ipAddress: form.value.ipAddress.trim(),
    entrances: form.value.entrances,
    userId: Number(authStore.user?.id)  
  }
  
  try {
    await $fetch('/api/address/add', {  
      method: 'POST',
      body: payload
    })
    navigateTo('/')
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Ошибка сохранения')
  }
}
</script>


<style scoped>
/* Существующие стили + новые */
.entrances-list {
  min-height: 80px;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.5rem;
}

.entrance-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.25rem;
}

.password-badge {
  background: #28a745;
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.btn-remove:hover {
  background: #c82333;
}

.btn-add-entrance {
  background: #28a745;
  color: white;
  border: 1px solid #28a745;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}

.btn-add-entrance:hover {
  background: #218838;
}

.empty-state {
  color: #6c757d;
  font-style: italic;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.85rem;
}
</style>
