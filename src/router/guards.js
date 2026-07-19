// router/guards.js
import { useUserStore } from '@/stores/useUserStore'

export function setupAuthGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 嘗試從 localStorage 恢復登入狀態
    if (!userStore.isAuthenticated) {
      userStore.restoreSession()
    }

    // 需要登入的頁面
    if (to.meta.requiresAuth) {
      if (!userStore.isAuthenticated) {
        // 未登入 → 跳轉到登入頁
        next({
          path: '/login',
          query: { redirect: to.fullPath } // 記住原本要去的頁面
        })
        return
      }
    }

    // 需要管理員權限的頁面
    if (to.meta.requiresAdmin) {
      if (!userStore.isAuthenticated) {
        // 未登入 → 跳轉到管理員登入頁
        next('/admin/login')
        return
      }

      if (!userStore.isAdmin) {
        // 已登入但不是管理員 → 跳轉到首頁
        alert('您沒有權限訪問此頁面')
        next('/')
        return
      }
    }

    // 已登入用戶不能訪問登入/註冊頁
    if (to.meta.guestOnly && userStore.isAuthenticated) {
      next('/')
      return
    }

    next()
  })
}