<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
const showFooter = ref(true)

const authStore = useAuthStore()

// ✅ Загружаем при монтировании (клиент)
onMounted(() => {
  const saved = localStorage.getItem('auth_user')
  if (saved) {
    try {
      authStore.user = JSON.parse(saved)
    } catch {
      localStorage.removeItem('auth_user')
    }
  }
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px); /* 140px = высота header + footer */
  padding: 2rem;
}
</style>