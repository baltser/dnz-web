<template>
  <div class="address-detail">
    <v-app-bar flat color="white" elevation="1">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Адрес: {{ address?.address }}</v-toolbar-title>
    </v-app-bar>
    
    <div v-if="loading" class="loading">
      Загрузка адреса...
    </div>
    
    <div v-else-if="error" class="error">
      Ошибка: {{ error }}
    </div>
    
    <div v-else-if="!address" class="no-data">
      Адрес не найден
    </div>
    
    <v-container v-else fluid class="pa-4">
      <!-- Основная информация -->
      <v-card class="main-info mb-6" elevation="3">
        <v-card-title class="headline">
          Основная информация
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-item">
                <strong>Адрес:</strong> {{ address.address }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item">
                <strong>IP адрес:</strong> {{ address.ip_address || 'Не указан' }}
              </div>
            </v-col>
            <v-col v-if="address.created_by" cols="12" md="6">
              <div class="info-item">
                <strong>Создатель:</strong> {{ address.created_by.username }} 
                ({{ address.created_by.email }})
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      
      <!-- Подъезды -->
      <v-card class="entrances-card" elevation="3">
        <v-card-title class="headline">
          Подъезды ({{ address.entrances?.length || 0 }})
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="entrance in address.entrances"
              :key="entrance.id"
              cols="12" sm="6" md="4" lg="3"
            >
              <v-card 
                class="entrance-card pa-4"
                elevation="2"
                @click="goToEntrance(entrance)"
                style="cursor: pointer;"
              >
                <v-card-title class="entrance-title">
                  {{ entrance.name_entrance }}
                </v-card-title>
                <v-card-subtitle>
                  Порт: {{ entrance.port }}
                </v-card-subtitle>
                <v-card-text v-if="entrance.password" class="password-section">
                  <v-chip color="success" size="small" class="mr-2">
                    🔓 Есть пароль
                  </v-chip>
                  <span class="password-text">
                    {{ entrance.password.decrypted_password }}
                  </span>
                </v-card-text>
                <v-card-text v-else class="no-password">
                  Нет пароля
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <div v-if="!address.entrances?.length" class="no-entrances">
            Подъезды не добавлены
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn 
            color="primary" 
            @click="$router.push('/addresses')"
            variant="outlined"
          >
            ← Назад к списку
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Entrance {
  id: number
  name_entrance: string
  port: number
  password?: {
    id: number
    decrypted_password: string
  } | null
}

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
  entrances: Entrance[]
}

const route = useRoute()
const router = useRouter()

const address = ref<Address | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchAddress = async (id: string) => {
  try {
    const response = await $fetch<Address>(`/api/address/${id}`)
    address.value = response
  } catch (err) {
    error.value = 'Не удалось загрузить адрес'
    console.error('Ошибка:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/addresses')
}

const goToEntrance = (entrance: Entrance) => {
  // Пока console.log, потом создадим /entrance/[id]
  console.log('Переход к подъезду:', entrance)
  // router.push(`/entrance/${entrance.id}`)
  alert(`Подъезд ${entrance.name_entrance}\nПорт: ${entrance.port}\nПароль: ${entrance.password?.decrypted_password || 'Нет'}`)
}

onMounted(() => {
  if (route.params.id) {
    fetchAddress(route.params.id as string)
  }
})
</script>

<style scoped>
.address-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-info, .entrances-card {
  max-width: 1200px;
  margin: 0 auto;
}

.info-item {
  padding: 1rem 0;
  font-size: 1.1rem;
}

.entrance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.entrance-title {
  font-size: 1.3rem !important;
  font-weight: 600;
}

.password-section {
  background: #f8f9ff;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.password-text {
  font-family: monospace;
  font-size: 1.1rem;
  color: #1976d2;
  word-break: break-all;
}

.no-password {
  color: #999;
  font-style: italic;
}

.no-entrances {
  text-align: center;
  color: #999;
  padding: 2rem;
  font-size: 1.1rem;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 4rem 2rem;
}
</style>
