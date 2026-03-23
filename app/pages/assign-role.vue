<template>
  <div class="page-assign-role">
    <h1>Назначить роль</h1>

    <table class="roles-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Текущая роль</th>
          <th>Новая роль</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>#{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.rule_name }}</td>
          <td>
            <select v-model="user.newRole" class="role-select">
              <option
                v-for="rule in rules"
                :key="rule"
                :value="rule"
              >
                {{ rule }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="actions">
      <button
        class="btn btn-primary"
        @click="saveAllRoles"
        :disabled="loading || !hasChanges"
      >
        {{ loading ? 'Сохранение...' : 'Сохранить всё' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

interface User {
  id: number
  username: string | null
  email: string
  rule_name: string
  newRole?: string
}

// Состояние
const users = ref<User[]>([])
const loading = ref(false)

// rules — захардкожен
const rules = ref<string[]>(['admin', 'user', 'moderator', 'block', 'guest'])

// Проверка, есть ли вообще изменения
const hasChanges = computed(() => {
  return users.value.some((user) => user.newRole !== user.rule_name)
})

// Загрузка списка пользователей
const loadUsers = async () => {
  try {
    const data = await $fetch<User[]>('/api/users/users')
    // инициализируем newRole = текущей роли
    users.value = data.map((user) => ({
      ...user,
      newRole: user.rule_name,
    }))
  } catch (e: any) {
    console.error('Error fetching users:', e)
  }
}

const saveAllRoles = async () => {
  const changedUsers = users.value.filter(
    (user) => user.newRole !== user.rule_name
  )

  if (!changedUsers.length) return

  loading.value = true
  try {
    const body = changedUsers.map((user) => ({
      userId: user.id,
      rule: user.newRole
    }))

    await $fetch('/api/users/assign-roles', {
      method: 'POST',
      body
    })

    changedUsers.forEach((user) => {
      user.rule_name = user.newRole!
    })
  } catch (e: any) {
    console.error('Error assigning roles:', e)
  } finally {
    loading.value = false
  }
}

loadUsers()
</script>

<style scoped>
.page-assign-role {
  padding: 2rem;
}

.roles-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.roles-table th {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  padding: 0.75rem;
}

.roles-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.role-select {
  padding: 0.35rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 130px;
}

.actions {
  margin-top: 1rem;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
