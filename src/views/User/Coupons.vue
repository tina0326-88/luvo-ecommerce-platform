<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">我的優惠券</h1>

      <!-- 狀態分頁 -->
      <div class="flex gap-2 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab.value
              ? 'bg-amber-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
        >
          {{ tab.label }}（{{ tab.list.length }}）
        </button>
      </div>

      <!-- 優惠券列表 -->
      <div
        v-if="activeList.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div
          v-for="coupon in activeList"
          :key="coupon.id"
          class="relative bg-white rounded-xl shadow-md overflow-hidden flex"
          :class="{ 'opacity-50': activeTab !== 'available' }"
        >
          <!-- 左側金額區塊 -->
          <div
            class="w-28 shrink-0 bg-amber-800 text-white flex flex-col items-center justify-center p-4"
          >
            <template v-if="coupon.type === 'cash'">
              <span class="text-2xl font-bold"
                >${{ coupon.discountValue }}</span
              >
              <span class="text-xs mt-1">現金折抵</span>
            </template>
            <template v-else-if="coupon.type === 'percent'">
              <span class="text-2xl font-bold"
                >{{ 100 - coupon.discountValue }}折</span
              >
              <span class="text-xs mt-1">折扣券</span>
            </template>
            <template v-else>
              <span class="text-lg font-bold">免運</span>
              <span class="text-xs mt-1">運費全免</span>
            </template>
          </div>

          <!-- 右側說明 -->
          <div class="flex-1 p-4">
            <p class="font-medium text-gray-800 mb-1">{{ coupon.title }}</p>
            <p class="text-xs text-gray-500 mb-1">
              {{
                coupon.minSpend > 0
                  ? `滿 NT$ ${formatPrice(coupon.minSpend)} 可用`
                  : "無門檻"
              }}
            </p>
            <p class="text-xs text-gray-400">
              有效期限至 {{ formatDate(coupon.expiredAt) }}
            </p>

            <span
              v-if="activeTab === 'used'"
              class="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full"
            >
              已使用
            </span>
            <span
              v-else-if="activeTab === 'expired'"
              class="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full"
            >
              已過期
            </span>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-24">
        <p class="text-gray-500 text-lg">
          目前沒有{{ activeTabLabel }}的優惠券
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { formatPrice, formatDate } from "@/utils/helpers";

const userStore = useUserStore();

const activeTab = ref("available");

const tabs = computed(() => [
  { value: "available", label: "可使用", list: userStore.availableCoupons },
  { value: "used", label: "已使用", list: userStore.usedCoupons },
  { value: "expired", label: "已過期", list: userStore.expiredCoupons },
]);

const activeList = computed(() => {
  return tabs.value.find((tab) => tab.value === activeTab.value)?.list || [];
});

const activeTabLabel = computed(() => {
  return tabs.value.find((tab) => tab.value === activeTab.value)?.label || "";
});
</script>
