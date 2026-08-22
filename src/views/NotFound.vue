<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <p class="text-8xl font-bold text-amber-800 mb-4">404</p>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">找不到這個頁面</h1>
      <p class="text-gray-500 mb-8">
        您要找的頁面可能已經移除、更名，或是網址輸入錯誤。
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <BaseButton variant="primary" @click="router.push('/')">
          回首頁
        </BaseButton>
        <BaseButton variant="outline" @click="router.back()">
          返回上一頁
        </BaseButton>
      </div>

      <div class="mt-10 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-3">或者您可能想找：</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <router-link
            v-for="link in suggestedLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-amber-800 hover:text-amber-800 transition-colors"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";

const router = useRouter();

const suggestedLinks = [
  { to: "/products/leather-shoes", label: "皮鞋系列" },
  { to: "/products/boots", label: "靴子系列" },
  { to: "/products/casual-shoes", label: "休閒鞋系列" },
  { to: "/stores", label: "門市查詢" },
  { to: "/user/orders", label: "訂單查詢" },
];
</script>
