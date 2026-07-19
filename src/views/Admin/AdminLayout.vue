<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頂部導航欄 -->
    <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Logo 和選單切換 -->
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <router-link to="/" class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-amber-800 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">L</span>
            </div>
            <span class="text-xl font-bold text-gray-800 hidden sm:block"
              >Luvo 管理後台</span
            >
          </router-link>
        </div>

        <!-- 右側功能區 -->
        <div class="flex items-center space-x-4">
          <!-- 通知 -->
          <button
            class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </button>

          <!-- 使用者選單 -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                class="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-medium text-sm">{{
                  userInitial
                }}</span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-gray-800">{{ userName }}</p>
                <p class="text-xs text-gray-500">管理員</p>
              </div>
              <svg
                class="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- 下拉選單 -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link
                to="/user/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showUserMenu = false"
              >
                個人資料
              </router-link>
              <router-link
                to="/user/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showUserMenu = false"
              >
                系統設定
              </router-link>
              <hr class="my-2" />
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要內容區 -->
    <div class="flex pt-16">
      <!-- 側邊欄 -->
      <aside
        :class="[
          'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out pt-16 lg:pt-0',
          isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
        ]"
      >
        <nav class="h-full overflow-y-auto py-6">
          <div class="px-4 space-y-2">
            <!-- 儀表板 -->
            <router-link
              to="/admin/dashboard"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive('/admin/dashboard')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span class="font-medium">儀表板</span>
            </router-link>

            <!-- 商品管理 -->
            <div>
              <button
                @click="toggleSection('products')"
                :class="[
                  'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                  isActive('/admin/products')
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span class="font-medium">商品管理</span>
                </div>
                <svg
                  :class="[
                    'w-4 h-4 transition-transform',
                    expandedSections.products ? 'rotate-180' : '',
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-if="expandedSections.products"
                class="ml-12 mt-2 space-y-1"
              >
                <router-link
                  to="/admin/products"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-amber-800 transition-colors"
                  @click="closeSidebarOnMobile"
                >
                  商品列表
                </router-link>
                <router-link
                  to="/admin/products/categories"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-amber-800 transition-colors"
                  @click="closeSidebarOnMobile"
                >
                  分類管理
                </router-link>
                <router-link
                  to="/admin/products/inventory"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-amber-800 transition-colors"
                  @click="closeSidebarOnMobile"
                >
                  庫存管理
                </router-link>
              </div>
            </div>

            <!-- 訂單管理 -->
            <router-link
              to="/admin/orders"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive('/user/orders')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span class="font-medium">訂單管理</span>
            </router-link>

            <!-- 會員管理 -->
            <router-link
              to="/admin/users"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive('/admin/users')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span class="font-medium">會員管理</span>
            </router-link>

            <!-- 數據統計 -->
            <router-link
              to="/admin/statistics"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive('/admin/statistics')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span class="font-medium">數據統計</span>
            </router-link>

            <!-- 內容管理 -->
            <div>
              <button
                @click="toggleSection('content')"
                :class="[
                  'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                  isActive('/admin/content')
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="font-medium">內容管理</span>
                </div>
                <svg
                  :class="[
                    'w-4 h-4 transition-transform',
                    expandedSections.content ? 'rotate-180' : '',
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div v-if="expandedSections.content" class="ml-12 mt-2 space-y-1">
                <router-link
                  to="/admin/content/banners"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-amber-800 transition-colors"
                  @click="closeSidebarOnMobile"
                >
                  輪播圖管理
                </router-link>
                <router-link
                  to="/admin/content/announcements"
                  class="block px-4 py-2 text-sm text-gray-600 hover:text-amber-800 transition-colors"
                  @click="closeSidebarOnMobile"
                >
                  公告管理
                </router-link>
              </div>
            </div>

            <!-- 優惠券管理 -->
            <router-link
              to="/admin/coupons"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive('/admin/coupons')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              <span class="font-medium">優惠券管理</span>
            </router-link>

            <!-- 系統設定 -->
            <router-link
              to="/admin/settings"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive('/admin/settings')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="font-medium">系統設定</span>
            </router-link>
          </div>

          <!-- 返回前台 -->
          <div class="px-4 mt-8 pt-6 border-t border-gray-200">
            <router-link
              to="/"
              class="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeSidebarOnMobile"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span class="font-medium">返回前台</span>
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- 遮罩層 (手機版) -->
      <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      ></div>

      <!-- 主要內容 -->
      <main class="flex-1 lg:ml-0">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 側邊欄狀態
const isSidebarOpen = ref(false);
const showUserMenu = ref(false);
const expandedSections = ref({
  products: false,
  content: false,
});

// 使用者資訊 (實際應該從 store 獲取)
const userName = ref("管理員");
const userInitial = computed(() => userName.value.charAt(0));

// 切換側邊欄
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 關閉側邊欄
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// 手機版點擊選單項後關閉側邊欄
const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    closeSidebar();
  }
};

// 切換使用者選單
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 切換展開區塊
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// 判斷當前路由是否激活
const isActive = (path) => {
  return route.path.startsWith(path);
};

// 登出處理
const handleLogout = () => {
  if (confirm("確定要登出嗎？")) {
    // 實際應該呼叫 store 的 logout action
    // 清除使用者資訊和 token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 跳轉到登入頁
    router.push("/login");
  }
  showUserMenu.value = false;
};

// 點擊外部關閉使用者選單
document.addEventListener("click", (e) => {
  if (!e.target.closest(".relative")) {
    showUserMenu.value = false;
  }
});
</script>

<style scoped>
/* 確保側邊欄滾動時不影響主內容 */
aside {
  height: calc(100vh - 4rem);
}

@media (min-width: 1024px) {
  aside {
    height: 100vh;
  }
}
</style>
