<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <!-- 卡片頭部：訂單編號、日期、狀態 -->
    <div
      class="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b border-gray-200 bg-gray-50"
    >
      <div class="flex flex-wrap items-center gap-3">
        <router-link
          :to="`/user/orders/${order.id}`"
          class="text-sm font-medium text-gray-800 hover:text-amber-800 transition-colors"
        >
          訂單編號：{{ order.orderNumber }}
        </router-link>
        <span class="text-sm text-gray-400">|</span>
        <span class="text-sm text-gray-500">{{ formattedDate }}</span>
      </div>

      <span
        class="px-3 py-1 text-xs font-bold rounded-full text-white"
        :class="statusBadgeClass"
      >
        {{ statusText }}
      </span>
    </div>

    <!-- 商品清單 -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="flex items-center gap-4 px-6 py-4"
      >
        <router-link
          :to="item.productId ? `/products/detail/${item.productId}` : ''"
          class="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
        </router-link>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 line-clamp-1">
            {{ item.name }}
          </p>
          <p v-if="item.spec" class="text-xs text-gray-500 mt-0.5">
            {{ item.spec }}
          </p>
          <p class="text-xs text-gray-500 mt-0.5">數量：{{ item.quantity }}</p>
        </div>

        <p class="text-sm font-bold text-amber-800 shrink-0">
          NT$ {{ formatPrice(item.price) }}
        </p>
      </div>

      <!-- 沒有商品明細時的保護性顯示 -->
      <div
        v-if="!order.items || order.items.length === 0"
        class="px-6 py-4 text-sm text-gray-400"
      >
        此訂單沒有商品明細
      </div>
    </div>

    <!-- 卡片底部：金額與操作按鈕 -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-gray-200"
    >
      <div class="text-sm text-gray-600">
        共 {{ totalQuantity }} 件商品，合計
        <span class="text-lg font-bold text-amber-800 ml-1">
          NT$ {{ formatPrice(order.totalAmount) }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <!-- 查看物流：只有出貨後才有意義 -->
        <BaseButton
          v-if="order.trackingNumber"
          variant="outline"
          size="sm"
          @click="$emit('view-tracking', order)"
        >
          查看物流
        </BaseButton>

        <!-- 待付款：前往付款 + 取消訂單 -->
        <template v-if="order.status === 'pending'">
          <BaseButton
            variant="outline"
            size="sm"
            :loading="loadingAction === 'cancel'"
            :disabled="loadingAction !== '' && loadingAction !== 'cancel'"
            aria-label="取消此訂單"
            @click="$emit('cancel-request', order)"
          >
            取消訂單
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
            :loading="loadingAction === 'pay'"
            :disabled="loadingAction !== '' && loadingAction !== 'pay'"
            aria-label="前往付款"
            @click="$emit('pay', order)"
          >
            前往付款
          </BaseButton>
        </template>

        <!-- 處理中：僅能取消 -->
        <template v-else-if="order.status === 'processing'">
          <BaseButton
            variant="outline"
            size="sm"
            :loading="loadingAction === 'cancel'"
            :disabled="loadingAction !== '' && loadingAction !== 'cancel'"
            aria-label="取消此訂單"
            @click="$emit('cancel-request', order)"
          >
            取消訂單
          </BaseButton>
        </template>

        <!-- 已出貨：確認收貨 -->
        <template v-else-if="order.status === 'shipped'">
          <BaseButton
            variant="primary"
            size="sm"
            :loading="loadingAction === 'confirm'"
            :disabled="loadingAction !== '' && loadingAction !== 'confirm'"
            aria-label="確認已收到商品"
            @click="$emit('confirm-receipt-request', order)"
          >
            確認收貨
          </BaseButton>
        </template>

        <!-- 已完成：評價 / 再買一次 -->
        <template v-else-if="order.status === 'completed'">
          <BaseButton
            variant="outline"
            size="sm"
            @click="$emit('buy-again', order)"
          >
            再買一次
          </BaseButton>
          <BaseButton
            v-if="!order.hasReviewed"
            variant="primary"
            size="sm"
            :loading="loadingAction === 'review'"
            :disabled="loadingAction !== '' && loadingAction !== 'review'"
            @click="$emit('review', order)"
          >
            評價訂單
          </BaseButton>
          <span
            v-else
            class="inline-flex items-center px-4 py-2 text-sm text-gray-400"
          >
            已完成評價
          </span>
        </template>

        <!-- 查看詳情：所有狀態都提供 -->
        <BaseButton
          variant="text"
          size="sm"
          @click="$emit('view-detail', order)"
        >
          查看詳情
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";

const props = defineProps({
  // 訂單資料，預期格式：
  // {
  //   id, orderNumber, status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled',
  //   createdAt: ISO 日期字串,
  //   items: [{ id, productId, name, image, spec, quantity, price }],
  //   totalAmount, trackingNumber, hasReviewed
  // }
  order: {
    type: Object,
    required: true,
  },
  // 目前正在進行中的操作，由父層控制，避免使用者連點觸發重複請求
  // '' | 'pay' | 'cancel' | 'confirm' | 'review'
  loadingAction: {
    type: String,
    default: "",
  },
});

// cancel-request / confirm-receipt-request：只發出「使用者想這麼做」的意圖，
// 真正的二次確認（BaseModal）與 API 呼叫交給父層 Orders.vue 處理
defineEmits([
  "view-detail",
  "view-tracking",
  "pay",
  "cancel-request",
  "confirm-receipt-request",
  "review",
  "buy-again",
]);

// 狀態文字與徽章顏色（顏色一律搭配文字說明，不單靠顏色傳達狀態）
const statusMap = {
  pending: { text: "待付款", class: "bg-yellow-500" },
  processing: { text: "處理中", class: "bg-blue-500" },
  shipped: { text: "已出貨", class: "bg-purple-500" },
  completed: { text: "已完成", class: "bg-green-500" },
  cancelled: { text: "已取消", class: "bg-gray-400" },
};

const statusText = computed(() => {
  return statusMap[props.order.status]?.text || props.order.status;
});

const statusBadgeClass = computed(() => {
  return statusMap[props.order.status]?.class || "bg-gray-400";
});

const totalQuantity = computed(() => {
  if (!props.order.items) return 0;
  return props.order.items.reduce((sum, item) => sum + item.quantity, 0);
});

const formattedDate = computed(() => {
  if (!props.order.createdAt) return "";
  const date = new Date(props.order.createdAt);
  if (Number.isNaN(date.getTime())) return props.order.createdAt;
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
});

// 建議之後移到 utils/helpers.js 統一管理，這裡先就地實作方便直接複製貼上
const formatPrice = (price) => {
  return (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>