<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- 導航欄 -->
    <AppHeader />

    <!-- 主要內容區 -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- 頁尾 -->
    <AppFooter />

    <!-- 購物車側邊欄（全域） -->
    <CartSidebar />

  </div>
</template>

<script setup>
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
</script>

<style>
/* 全局樣式已在 main.css 中定義 */
</style>
