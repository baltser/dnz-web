<template>
  <div class="home-page">
    <h1>Главная</h1>

    <div class="btn-grid">
      <NuxtLink
        v-if="isAdmin"
        to="/assign-role"
        class="btn btn-square"
      >
        Назначить роль
      </NuxtLink>

      <NuxtLink to="/add-address" class="btn btn-square">
        Добавить адрес
      </NuxtLink>
      <NuxtLink to="/show-list-addresses" class="btn btn-square">
        Список адресов
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = ref(useAuthStore())

const isAdmin = computed(() => {
  const user = authStore.value.user
  return user && user.rule_name === 'admin'
})
</script>

<style scoped>
.home-page {
  padding: 2rem;
}

.btn-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.btn {
  padding: 0;
  text-decoration: none;
  color: white;
  background: #007bff;
  border-radius: 8px;
  text-align: center;
}

.btn-square {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.btn-square:hover {
  background: #0056b3;
}
</style>
