<template>
  <div>
    <h1>Список адресов</h1>
    
    <div v-if="loading" class="loading">
      Загрузка...
    </div>
    
    <div v-else-if="error" class="error">
      Ошибка: {{ error }}
    </div>
    
    <div v-else-if="addresses.length === 0" class="no-data">
      Адреса не найдены
    </div>
    
    <div v-else class="addresses-grid">
      <div 
        v-for="address in addresses" 
        :key="address.id"
        class="address-card"
      >
        <div class="card-header">
          <h3>{{ address.address }}</h3>
          
          <div v-if="address.ip_address" class="info-row">
            <strong>IP:</strong> {{ address.ip_address }}
          </div>
          
          <div v-if="address.created_by" class="info-row">
            <strong>Создатель:</strong> {{ address.created_by.username }} 
            ({{ address.created_by.email }})
          </div>
        </div>
        
        <div v-if="address.entrances && address.entrances.length > 0" class="entrances-section">
          <h4>Подъезды:</h4>
          <div class="entrances-buttons">
            <button
              v-for="entrance in address.entrances" 
              :key="entrance.id"
              class="entrance-btn"
              :title="entrance.password?.decrypted_password || 'Нет пароля'"
              @click="openEntrance(entrance)"
            >
              {{ entrance.name_entrance }} ({{ entrance.port }})
              <span v-if="entrance.password" class="password-badge">
                🔓 {{ entrance.password.decrypted_password.slice(0, 8) }}...
              </span>
            </button>
          </div>
        </div>
        <div v-else class="no-entrances">
          Подъезды не добавлены
        </div>
        
        <div class="card-actions">
          <button @click="editAddress(address.id)" class="edit-btn">
            Редактировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Address {
  id: number
  address: string
  ip_address?: string | null
  created_by?: {
    id: number
    username: string
    email: string
    rule_name: string
  } | null
  entrances: Array<{
    id: number
    name_entrance: string
    port: number
    password?: {
      id: number
      decrypted_password: string 
    } | null
  }>
}

const addresses = ref<Address[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchAddresses = async () => {
  try {
    const response = await $fetch('/api/address/adresses') 
    addresses.value = response
  } catch (err) {
    error.value = 'Не удалось загрузить адреса'
    console.error('Ошибка загрузки:', err)
  } finally {
    loading.value = false
  }
}

const openEntrance = (entrance: any) => {
  console.log('Открыть подъезд:', entrance)
  // Здесь можно navigateTo(`/entrance/${entrance.id}`) или модалка
  alert(`Подъезд ${entrance.name_entrance}, порт ${entrance.port}, пароль: ${entrance.password?.decrypted_password}`)
}

const editAddress = (id: number) => {
  // navigateTo(`/address/${id}`) если используете Nuxt router
  console.log('Редактировать адрес:', id)
}

onMounted(fetchAddresses)
</script>

<style scoped>
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.address-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.address-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.card-header h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.3rem;
}

.info-row {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #666;
}

.entrances-section h4 {
  margin: 1rem 0 0.5rem 0;
  font-size: 1.1rem;
  color: #444;
}

.entrances-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.entrance-btn {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
}

.entrance-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.password-badge {
  display: block;
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.no-entrances {
  color: #999;
  font-style: italic;
  padding: 1rem;
  text-align: center;
}

.card-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.edit-btn {
  background: #f8f9fa;
  color: #007bff;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #007bff;
  color: white;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .entrance-btn {
    min-width: 100%;
  }
}
</style>


<style scoped>
.addresses-list {
  max-width: 1200px;
  margin: 0 auto;
}

.address-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: #f9f9f9;
}

.address-card h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.info-row {
  margin-bottom: 10px;
  color: #666;
}

.entrances-section {
  margin-top: 15px;
}

.entrances-section h4 {
  margin: 0 0 10px 0;
  color: #444;
}

.entrances-list {
  list-style: none;
  padding: 0;
}

.entrance-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.password-info {
  font-size: 0.9em;
  color: #007bff;
}

.no-entrances {
  color: #999;
  font-style: italic;
  margin-top: 10px;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 40px;
  font-size: 1.1em;
}

.error {
  color: #d32f2f;
}

.loading {
  color: #666;
}
</style>
