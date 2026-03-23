<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Регистрация</h1>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Имя</label>
          <input v-model="name" type="text" required placeholder="Ваше имя" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="password" type="password" required minlength="6" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Подтвердите пароль</label>
          <input v-model="confirmPassword" type="password" required placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
          {{ authStore.loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
        <p class="auth-link">
          Уже есть аккаунт? <NuxtLink to="/login">Войти</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Пароли не совпадают'
    return
  }
  
  const result = await authStore.register(name.value, email.value, password.value)
  if (result.success) {
    navigateTo('/')
  }
}
</script>
