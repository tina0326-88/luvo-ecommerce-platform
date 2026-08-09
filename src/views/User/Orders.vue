<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">訂單查詢</h1>

      <!-- 狀態篩選 + 搜尋 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="statusFilter = tab.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              statusFilter === tab.value
                ? 'bg-amber-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜尋訂單編號"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <!-- 訂單列表 -->
      <div v-if="pagedOrders.length > 0" class="space-y-6">
        <OrderItem
          v-for="order in pagedOrders"
          :key="order.id"
          :order="order"
          :loading-action="loadingOrderId === order.id ? loadingAction : ''"
          @cancel-request="openCancelModal"
          @confirm-receipt-request="openConfirmReceiptModal"
          @pay="handlePay"
          @review="handleReview"
          @buy-again="handleBuyAgain"
          @view-tracking="openTrackingModal"
          @view-detail="goToDetail"
        />
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-24">
        <svg
          class="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-500 text-lg">沒有符合條件的訂單</p>
      </div>

      <!-- 分頁 -->
      <div v-if="filteredOrders.length > pageSize" class="mt-8">
        <BasePagination
          v-model:current-page="currentPage"
          :total="filteredOrders.length"
          :page-size="pageSize"
        />
      </div>
    </div>

    <!-- 取消訂單確認 Modal -->
    <BaseModal
      v-model="showCancelModal"
      title="取消訂單"
      size="sm"
      @confirm="confirmCancel"
    >
      <p class="text-gray-600">
        確定要取消訂單「{{ pendingOrder?.orderNumber }}」嗎？取消後無法復原。
      </p>
    </BaseModal>

    <!-- 確認收貨 Modal -->
    <BaseModal
      v-model="showConfirmReceiptModal"
      title="確認收貨"
      size="sm"
      @confirm="confirmReceipt"
    >
      <p class="text-gray-600">
        確認已收到訂單「{{ pendingOrder?.orderNumber }}」的商品嗎？
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
import { useRouter } from "vue-router";
import OrderItem from "@/components/business/OrderItem.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import BasePagination from "@/components/base/BasePagination.vue";
import { useOrderStore } from "@/stores/useOrderStore";

const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders);
const router = useRouter();

const statusTabs = [
  { value: "", label: "全部" },
  { value: "pending", label: "待付款" },
  { value: "processing", label: "處理中" },
  { value: "shipped", label: "已出貨" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const statusFilter = ref("");
const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = 5;

const filteredOrders = computed(() => {
  let result = orders.value;

  if (statusFilter.value) {
    result = result.filter((order) => order.status === statusFilter.value);
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    result = result.filter((order) =>
      order.orderNumber.toLowerCase().includes(keyword)
    );
  }

  return [...result].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
});

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredOrders.value.slice(start, start + pageSize);
});

// 操作中的訂單與 loading 狀態，交給 OrderItem 顯示對應按鈕的 loading
const loadingOrderId = ref(null);
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

// 取消訂單：先 emit 出來的只是意圖，這裡用 Modal 二次確認後才真的執行
const showCancelModal = ref(false);
const pendingOrder = ref(null);

const openCancelModal = (order) => {
  pendingOrder.value = order;
  showCancelModal.value = true;
};

// confirmCancel() 裡原本直接改 order.status = "cancelled"，改成呼叫 store：
const confirmCancel = async () => {
  if (!pendingOrder.value) return;
  const order = pendingOrder.value;

  loadingOrderId.value = order.id;
  loadingAction.value = "cancel";
  showCancelModal.value = false;

  await new Promise((resolve) => setTimeout(resolve, 500));

  orderStore.cancelOrder(order.id);
  showToast(`訂單「${order.orderNumber}」已取消`);

  loadingOrderId.value = null;
  loadingAction.value = "";
  pendingOrder.value = null;
};

// 確認收貨
const showConfirmReceiptModal = ref(false);

const openConfirmReceiptModal = (order) => {
  pendingOrder.value = order;
  showConfirmReceiptModal.value = true;
};

// confirmReceipt() 同樣改成呼叫 store：
const confirmReceipt = async () => {
  if (!pendingOrder.value) return;
  const order = pendingOrder.value;

  loadingOrderId.value = order.id;
  loadingAction.value = "confirm";
  showConfirmReceiptModal.value = false;

  await new Promise((resolve) => setTimeout(resolve, 500));

  orderStore.confirmReceipt(order.id);
  showToast(`已確認收到訂單「${order.orderNumber}」`);

  loadingOrderId.value = null;
  loadingAction.value = "";
  pendingOrder.value = null;
};

const handlePay = (order) => {
  router.push(`/checkout?orderId=${order.id}`);
};

const handleReview = (order) => {
  // TODO: 開啟評價 Modal，待評價系統元件完成後補上
  console.log("review order", order.orderNumber);
};

const handleBuyAgain = (order) => {
  // TODO: 待 cartStore 補上「依訂單品項批次加入購物車」的方法後串接
  console.log("buy again", order.orderNumber);
};

const openTrackingModal = (order) => {
  // TODO: 物流追蹤目前為模擬資料，之後可用 Modal 顯示物流狀態時間軸
  console.log("view tracking", order.trackingNumber);
};

const goToDetail = (order) => {
  router.push(`/user/orders/${order.id}`);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>