<template>
  <header class="bg-[#512830] shadow-lg sticky top-0 z-50">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center">
            <div class="text-white text-2xl font-bold">Luvo 履藝</div>
          </router-link>
        </div>

        <!-- 桌面導航選單 -->
        <ul class="hidden lg:flex items-center space-x-8">
          <li>
            <router-link
              to="/"
              class="text-white hover:text-gray-200 transition-colors font-medium"
            >
              首頁
            </router-link>
          </li>

          <!-- 最新優惠 -->
          <li class="relative group">
            <button
              class="text-white hover:text-gray-200 transition-colors font-medium flex items-center"
            >
              最新優惠
              <svg
                class="w-4 h-4 ml-1"
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
            <ul
              class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <li>
                <router-link
                  to="/new-member"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  新會員首購禮
                </router-link>
              </li>
              <li>
                <router-link
                  to="/brand"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  品牌專屬優惠
                </router-link>
              </li>
              <li>
                <router-link
                  to="/discount"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                >
                  買2送1
                </router-link>
              </li>
            </ul>
          </li>

          <!-- 商品系列 -->
          <li class="relative group">
            <button
              class="text-white hover:text-gray-200 transition-colors font-medium flex items-center"
            >
              商品系列
              <svg
                class="w-4 h-4 ml-1"
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
            <ul
              class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <li>
                <router-link
                  to="/products/leather-shoes"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  皮鞋
                </router-link>
              </li>
              <li>
                <router-link
                  to="/products/boots"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  靴子
                </router-link>
              </li>
              <li>
                <router-link
                  to="/products/casual-shoes"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                >
                  休閒鞋
                </router-link>
              </li>
            </ul>
          </li>

          <!-- 生活配件 -->
          <li class="relative group">
            <button
              class="text-white hover:text-gray-200 transition-colors font-medium flex items-center"
            >
              生活配件
              <svg
                class="w-4 h-4 ml-1"
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
            <ul
              class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <li>
                <router-link
                  to="/accessories/socks"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  襪子
                </router-link>
              </li>
              <li>
                <router-link
                  to="/accessories/belts"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  皮帶
                </router-link>
              </li>
              <li>
                <router-link
                  to="/accessories/bags"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                >
                  托特包
                </router-link>
              </li>
            </ul>
          </li>

          <!-- 註冊/登入 -->
          <li class="relative group">
            <button
              class="text-white hover:text-gray-200 transition-colors font-medium flex items-center"
            >
              會員專區
              <svg
                class="w-4 h-4 ml-1"
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
            <ul
              class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <li>
                <router-link
                  to="/login"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  註冊/登入
                </router-link>
              </li>
              <li>
                <router-link
                  to="/user/profile"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  個人資料
                </router-link>
              </li>
              <li>
                <router-link
                  to="/user/orders"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  訂單查詢
                </router-link>
              </li>
              <li>
                <router-link
                  to="/user/favorites"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  收藏清單
                </router-link>
              </li>
              <li>
                <router-link
                  to="/cart"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  購物車
                </router-link>
              </li>
              <li>
                <router-link
                  to="/user/coupons"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                >
                  我的優惠券
                </router-link>
              </li>
            </ul>
          </li>

          <li>
            <router-link
              to="/stores"
              class="text-white hover:text-gray-200 transition-colors font-medium"
            >
              門市查詢
            </router-link>
          </li>

          <!-- <li>
            <router-link
              to="/admin/dashboard"
              class="text-white hover:text-gray-200 transition-colors font-medium"
            >
              管理後台
            </router-link>
          </li> -->
        </ul>

        <!-- 手機版漢堡選單按鈕 -->
        <button
          @click="toggleMenu"
          class="lg:hidden text-white text-3xl focus:outline-none"
        >
          <svg
            class="w-8 h-8"
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
      </div>

      <!-- 手機版選單 -->
      <div
        :class="[
          'lg:hidden overflow-hidden transition-all duration-300',
          isMenuOpen ? 'max-h-screen' : 'max-h-0',
        ]"
      >
        <ul class="py-4 space-y-2">
          <li>
            <router-link
              to="/"
              class="block py-2 text-white hover:bg-[#6d3540] rounded px-4"
              @click="closeMenu"
            >
              首頁
            </router-link>
          </li>

          <!-- 最新優惠 (手機版) -->
          <li>
            <div class="text-white font-medium px-4 py-2">最新優惠</div>
            <ul class="pl-8 space-y-1">
              <li>
                <router-link
                  to="/new-member"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  新會員首購禮
                </router-link>
              </li>
              <li>
                <router-link
                  to="/brand"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  品牌專屬優惠
                </router-link>
              </li>
              <li>
                <router-link
                  to="/discount"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  買2送1
                </router-link>
              </li>
            </ul>
          </li>

          <!-- 商品系列 (手機版) -->
          <li>
            <div class="text-white font-medium px-4 py-2">商品系列</div>
            <ul class="pl-8 space-y-1">
              <li>
                <router-link
                  to="/products/leather-shoes"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  皮鞋
                </router-link>
              </li>
              <li>
                <router-link
                  to="/products/boots"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  靴子
                </router-link>
              </li>
              <li>
                <router-link
                  to="/products/casual-shoes"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  休閒鞋
                </router-link>
              </li>
            </ul>
          </li>

          <li>
            <div class="text-white font-medium px-4 py-2">註冊/登入</div>
            <ul class="pl-8 space-y-1">
              <li>
                <router-link
                  to="/user/profile"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  個人資料
                </router-link>
              </li>
              <li>
                <router-link
                  to="/user/orders"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  訂單查詢
                </router-link>
              </li>
              <li>
                <router-link
                  to="/favorites"
                  class="block py-2 text-white text-sm hover:bg-[#6d3540] rounded px-4"
                  @click="closeMenu"
                >
                  收藏清單
                </router-link>
              </li>
            </ul>
          </li>

          <li>
            <router-link
              to="/cart"
              class="block py-2 text-white hover:bg-[#6d3540] rounded px-4"
              @click="closeMenu"
            >
              購物車
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/dashboard"
              class="text-white hover:text-gray-200 transition-colors font-medium"
            >
              管理後台
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
