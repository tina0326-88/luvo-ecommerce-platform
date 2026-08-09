import { useUserStore } from "@/stores/useUserStore";

/**
 * 路由守衛
 *
 * 專案目前未串接真實後端，這裡的「登入驗證」只檢查 useUserStore 裡
 * 是否有模擬登入的 currentUser（來自 localStorage），並非真正的權限驗證。
 * 串接後端後，應改為驗證 token 是否有效，這裡的守衛邏輯結構不需要改變。
 */
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
    document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
  });
}