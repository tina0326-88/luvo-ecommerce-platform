<template>
  <footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-white text-lg font-bold mb-4">LUVO 履藝皮鞋</h3>
          <p class="text-sm leading-relaxed">
            以創新的設計理念重新定義皮鞋工藝，
            讓每雙鞋都陪伴人們邁出自信的每一步。
          </p>
        </div>

        <div>
          <h4 class="text-white font-medium mb-4">商品分類</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/products/leather-shoes" class="hover:text-white transition-colors">皮鞋系列</router-link></li>
            <li><router-link to="/products/boots" class="hover:text-white transition-colors">靴子系列</router-link></li>
            <li><router-link to="/products/casual-shoes" class="hover:text-white transition-colors">休閒鞋系列</router-link></li>
            <li><router-link to="/accessories/bags" class="hover:text-white transition-colors">包款系列</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-medium mb-4">會員服務</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/user/orders" class="hover:text-white transition-colors">訂單查詢</router-link></li>
            <li><router-link to="/user/favorites" class="hover:text-white transition-colors">收藏清單</router-link></li>
            <li><router-link to="/stores" class="hover:text-white transition-colors">門市查詢</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-medium mb-4">關於本專案</h4>
          <p class="text-sm leading-relaxed">
            本網站為前端作品展示專案，未串接真實後端與金流，
            商品與訂單資料僅供功能展示使用。
          </p>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
        © {{ currentYear }} Luvo Ecommerce. 本專案僅供個人學習與作品紀錄使用。
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>