<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-amber-800">
          LUVO
        </router-link>

        <!-- 主導覽（桌面版） -->
        <nav class="hidden md:flex items-center gap-6">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <!-- 右側操作 -->
        <div class="flex items-center gap-4">
          <!-- 收藏 -->
          <router-link
            to="/user/favorites"
            class="hidden sm:block text-gray-600 hover:text-amber-800 transition-colors"
            aria-label="收藏清單"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </router-link>

          <!-- 購物車 -->
          <router-link
            to="/cart"
            class="relative text-gray-600 hover:text-amber-800 transition-colors"
            aria-label="購物車"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 bg-amber-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <!-- 會員 -->
          <router-link
            v-if="userStore.isLoggedIn"
            to="/user/profile"
            class="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors"
          >
            {{ userStore.currentUser?.name }}
          </router-link>
          <router-link
            v-else
            to="/user/login"
            class="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors"
          >
            登入
          </router-link>

          <!-- 手機版選單按鈕 -->
          <button
            class="md:hidden text-gray-600"
            aria-label="開啟選單"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 手機版導覽 -->
      <nav v-if="mobileMenuOpen" class="md:hidden pb-4 flex flex-col gap-3">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "@/stores/useCartStore";
import { useUserStore } from "@/stores/useUserStore";
import { NAV_LINKS } from "@/utils/constants";

const cartStore = useCartStore();
const userStore = useUserStore();

const navLinks = NAV_LINKS;
const mobileMenuOpen = ref(false);
</script>