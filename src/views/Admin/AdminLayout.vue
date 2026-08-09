<template>
  <div class="flex min-h-screen bg-gray-100">
    <AppSidebar
      :collapsed="sidebarCollapsed"
      @toggle-collapsed="sidebarCollapsed = !sidebarCollapsed"
      @logout-request="showLogoutModal = true"
    />

    <div class="flex-1 flex flex-col min-w-0">
      <!-- 頂欄 -->
      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6">
        <h1 class="text-lg font-bold text-gray-800">
          {{ route.meta.title || "後台管理" }}
        </h1>

        <router-link
          to="/"
          class="text-sm text-gray-500 hover:text-amber-800 transition-colors"
        >
          回前台
        </router-link>
      </header>

      <!-- 頁面內容 -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 登出確認 Modal -->
    <BaseModal
      v-model="showLogoutModal"
      title="登出"
      size="sm"
      @confirm="confirmLogout"
    >
      <p class="text-gray-600">確定要登出管理後台嗎？</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import { useUserStore } from "@/stores/useUserStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 側邊欄收合狀態放在 Layout 層，讓所有後台子頁面共用同一個狀態，
// 不會因為切換頁面（Dashboard → Products）就重置收合狀態
const sidebarCollapsed = ref(false);

const showLogoutModal = ref(false);

const confirmLogout = () => {
  userStore.logout();
  showLogoutModal.value = false;
  router.push({ name: "Login" });
};
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>