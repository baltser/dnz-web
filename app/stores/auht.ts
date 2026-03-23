import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | { id: string; name: string; email: string; rule_name: string }>(null)
  const loading = ref(false)
  const error = ref('')

  if (import.meta.client) {
    const saved = localStorage.getItem('auth_user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch {
        localStorage.removeItem('auth_user')
      }
    }
  }

const login = async (email: string, password: string) => {
  loading.value = true
  error.value = ''

  try {
    interface LoginResponse {
      success: boolean
      id?: string
      name?: string
      email?: string
      rule_name?: string
      error?: string
    }

    const response = await $fetch<LoginResponse>('/api/login', {
      method: 'POST',
      body: { email, password },
    })

    if (!response.success) {
      error.value = response.error || 'Неверные данные'
      return { success: false }
    }

    user.value = {
      id: response.id!,
      name: response.name!,
      email: response.email!,
      rule_name: response.rule_name!
    }
    localStorage.setItem('auth_user', JSON.stringify(user.value))
    console.log(user.value)
    
    return { success: true }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Ошибка сервера'
    return { success: false }
  } finally {
    loading.value = false
  }
}

  
const register = async (name: string, email: string, password: string) => {
  loading.value = true
  error.value = ''
  
  try {
    interface ApiResponse {
      success: boolean
      id?: string
      name?: string
      email?: string
      rule_name?: string
      error?: string
    }
    
    const response = await $fetch<ApiResponse>('/api/register', {
      method: 'POST',
      body: { name, email, password }
    }) as ApiResponse
    
    if (!response.success) {
      error.value = response.error || 'Ошибка регистрации'
      return { success: false }
    }

    user.value = { id: response.id!, name: response.name!, email: response.email!, rule_name: response.rule_name! }
    localStorage.setItem('auth_user', JSON.stringify(user.value))
    return { success: true }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Ошибка сервера'
    return { success: false }
  } finally {
    loading.value = false
  }
}



  const logout = () => {
    user.value = null
    error.value = ''
    localStorage.removeItem('auth_user')
    navigateTo('/')
  }

  return { user, loading, error, login, register, logout }
})
