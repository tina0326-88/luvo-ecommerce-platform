import { useUserStore } from "@/stores/useUserStore";

export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    // 需要登入才能進入的頁面
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      });
      return;
    }

    // 需要管理員權限的頁面
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      next({ name: "Home" });
      return;
    }

    // 已登入者不應該再看到登入 / 註冊頁
    if (to.meta.guestOnly && userStore.isLoggedIn) {
      next({ name: "Home" });
      return;
    }

    next();
  });

  // 切換頁面時更新瀏覽器標籤標題
  router.afterEach((to) => {
    const baseTitle = "Luvo 履藝皮鞋";
    document.title = to.meta.title
      ? `${to.meta.title} | ${baseTitle}`
      : baseTitle;
  });
}
