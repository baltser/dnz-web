<template>
  <header class="header">
    <div class="container">
      <NuxtLink to="/" class="logo">DNZ Web</NuxtLink>

      <!-- Авторизован -->
      <div v-if="authStore.user" class="auth-section">
        <span class="user-name">{{ authStore.user.name }}</span>
        <button @click="authStore.logout" class="btn-logout">Выйти</button>
      </div>

      <!-- Не авторизован -->
      <div v-else class="auth-section">
        <NuxtLink to="/auth/login" class="btn-login">Войти</NuxtLink>
        <NuxtLink to="/auth/register" class="btn-register">Регистрация</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = ref(useAuthStore())

</script>

=<style scoped>
.user-name {
  font-weight: 500;
  color: #333;
  margin-right: 1rem;
}
.header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4f46e5;
  text-decoration: none;
}

.auth-section {
  display: flex;
  gap: 1rem;
}

.btn-logout,
.btn-login,
.btn-register {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login {
  color: #4f46e5;
  background: transparent;
  border: 1px solid #4f46e5;
}

.btn-login:hover {
  background: #4f46e5;
  color: white;
}

.btn-register {
  background: #4f46e5;
  color: white;
}

.btn-register:hover {
  background: #6366f1;
}

.btn-logout {
  color: #dc2626;
  background: transparent;
}

.btn-logout:hover {
  background: #fee2e2;
  color: #dc2626;
}
</style>
