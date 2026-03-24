<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Вход</h1>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="test@example.com" />
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="password" type="password" required placeholder="123456" />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
          {{ authStore.loading ? 'Вход...' : 'Войти' }}
        </button>
        <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
        <p class="auth-link">
          Нет аккаунта? <NuxtLink to="/register">Зарегистрироваться</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    navigateTo('/')
  }
}
</script>
