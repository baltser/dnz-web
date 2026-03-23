export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const user = authStore.user

//   if (to.path === '/' || to.path === '/login' || to.path === '/register') {
//     return
//   }

//   if (!user) {
//     return navigateTo('/login')
//   }

//   if (user.rule_name === 'block') {
//     return navigateTo('/access-blocked')
//   }

  // если хочешь, можно здесь отдельно отфильтровать доступ к главной
  // if (to.path === '/' && user.rule_name !== 'admin') {
  //   return navigateTo('/user-home')
  // }
})