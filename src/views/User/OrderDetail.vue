<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="order" class="container mx-auto px-4 py-12 max-w-3xl">
      <!-- 麵包屑 -->
      <nav class="text-sm text-gray-500 mb-6">
        <router-link to="/user/orders" class="hover:text-amber-800"
          >訂單查詢</router-link
        >
        <span class="mx-2">/</span>
        <span class="text-gray-700">{{ order.orderNumber }}</span>
      </nav>

      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <!-- 頭部 -->
        <div
          class="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b border-gray-200 bg-gray-50"
        >
          <div>
            <p class="text-sm text-gray-500">訂單編號</p>
            <p class="text-base font-bold text-gray-800">
              {{ order.orderNumber }}
            </p>
          </div>
          <span
            class="px-3 py-1 text-xs font-bold rounded-full text-white"
            :class="statusBadgeClass"
          >
            {{ statusText }}
          </span>
        </div>

        <!-- 訂單進度時間軸：已取消的訂單不顯示進度條，改顯示取消提示 -->
        <div class="px-6 py-6 border-b border-gray-200">
          <div v-if="order.status !== 'cancelled'" class="flex items-center">
            <template v-for="(step, index) in progressSteps" :key="step.key">
              <div class="flex flex-col items-center flex-1">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  :class="
                    stepIndex >= index
                      ? 'bg-amber-800 text-white'
                      : 'bg-gray-200 text-gray-400'
                  "
                >
                  {{ index + 1 }}
                </div>
                <span
                  class="text-xs mt-2 text-center"
                  :class="
                    stepIndex >= index
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-400'
                  "
                >
                  {{ step.label }}
                </span>
              </div>
              <div
                v-if="index < progressSteps.length - 1"
                class="flex-1 h-0.5 -mt-5"
                :class="stepIndex > index ? 'bg-amber-800' : 'bg-gray-200'"
              ></div>
            </template>
          </div>
          <p v-else class="text-sm text-gray-500">
            此訂單已於 {{ formattedDate }} 取消
          </p>
        </div>

        <!-- 物流資訊 -->
        <div
          v-if="order.trackingNumber"
          class="px-6 py-4 border-b border-gray-200 text-sm"
        >
          <span class="text-gray-500">物流追蹤編號：</span>
          <span class="font-medium text-gray-800">{{
            order.trackingNumber
          }}</span>
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
              <p class="text-xs text-gray-500 mt-0.5">
                數量：{{ item.quantity }}
              </p>
            </div>
            <p class="text-sm font-bold text-amber-800 shrink-0">
              NT$ {{ formatPrice(item.price * item.quantity) }}
            </p>
          </div>
        </div>

        <!-- 金額明細 -->
        <div class="px-6 py-4 border-t border-gray-200 space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>共 {{ totalQuantity }} 件商品</span>
            <span class="text-lg font-bold text-amber-800">
              NT$ {{ formatPrice(order.totalAmount) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex flex-wrap gap-3 justify-end">
        <BaseButton
          v-if="order.status === 'pending'"
          variant="outline"
          :loading="loadingAction === 'cancel'"
          @click="showCancelModal = true"
        >
          取消訂單
        </BaseButton>
        <BaseButton
          v-if="order.status === 'pending'"
          variant="primary"
          @click="router.push(`/checkout?orderId=${order.id}`)"
        >
          前往付款
        </BaseButton>
        <BaseButton
          v-if="order.status === 'processing'"
          variant="outline"
          :loading="loadingAction === 'cancel'"
          @click="showCancelModal = true"
        >
          取消訂單
        </BaseButton>
        <BaseButton
          v-if="order.status === 'shipped'"
          variant="primary"
          :loading="loadingAction === 'confirm'"
          @click="showConfirmReceiptModal = true"
        >
          確認收貨
        </BaseButton>
        <BaseButton
          v-if="order.status === 'completed' && !order.hasReviewed"
          variant="primary"
          @click="handleReview"
        >
          評價訂單
        </BaseButton>
      </div>
    </div>

    <!-- 找不到訂單 -->
    <div v-else class="container mx-auto px-4 py-24 text-center">
      <p class="text-gray-500 text-lg mb-6">找不到這筆訂單</p>
      <BaseButton variant="primary" @click="router.push('/user/orders')">
        回訂單查詢
      </BaseButton>
    </div>

    <!-- 取消訂單確認 -->
    <BaseModal
      v-model="showCancelModal"
      title="取消訂單"
      size="sm"
      @confirm="confirmCancel"
    >
      <p class="text-gray-600">
        確定要取消訂單「{{ order?.orderNumber }}」嗎？取消後無法復原。
      </p>
    </BaseModal>

    <!-- 確認收貨 -->
    <BaseModal
      v-model="showConfirmReceiptModal"
      title="確認收貨"
      size="sm"
      @confirm="confirmReceipt"
    >
      <p class="text-gray-600">
        確認已收到訂單「{{ order?.orderNumber }}」的商品嗎？
      </p>
    </BaseModal>

    <!-- Toast -->
    <transition name="fade">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice, formatDate } from "@/utils/helpers";
import { ORDER_STATUS_MAP } from "@/utils/constants";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const order = computed(() => orderStore.getOrderById(route.params.id));

const statusText = computed(
  () => ORDER_STATUS_MAP[order.value?.status]?.text || "",
);
const statusBadgeClass = computed(
  () => ORDER_STATUS_MAP[order.value?.status]?.class || "bg-gray-400",
);

const formattedDate = computed(() => formatDate(order.value?.createdAt));

const totalQuantity = computed(() => {
  if (!order.value?.items) return 0;
  return order.value.items.reduce((sum, item) => sum + item.quantity, 0);
});

// 進度條步驟，取消訂單不走這個進度條（見 template 判斷）
const progressSteps = [
  { key: "pending", label: "訂單成立" },
  { key: "processing", label: "處理中" },
  { key: "shipped", label: "已出貨" },
  { key: "completed", label: "已完成" },
];

const stepIndex = computed(() => {
  return progressSteps.findIndex((step) => step.key === order.value?.status);
});

const loadingAction = ref("");
const toastMessage = ref("");
let toastTimer = null;
const showToast = (message) => {
  toastMessage.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
};

// 取消訂單：一樣走「意圖 → Modal 確認 → 執行」
const showCancelModal = ref(false);
const confirmCancel = async () => {
  if (!order.value) return;
  loadingAction.value = "cancel";
  showCancelModal.value = false;

  await new Promise((resolve) => setTimeout(resolve, 500));

  orderStore.cancelOrder(order.value.id);
  showToast(`訂單「${order.value.orderNumber}」已取消`);
  loadingAction.value = "";
};

// 確認收貨
const showConfirmReceiptModal = ref(false);
const confirmReceipt = async () => {
  if (!order.value) return;
  loadingAction.value = "confirm";
  showConfirmReceiptModal.value = false;

  await new Promise((resolve) => setTimeout(resolve, 500));

  orderStore.confirmReceipt(order.value.id);
  showToast(`已確認收到訂單「${order.value.orderNumber}」`);
  loadingAction.value = "";
};

const handleReview = () => {
  // TODO: 評價功能元件尚未建立，待評價 Modal 完成後串接
  console.log("review order", order.value.orderNumber);
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
