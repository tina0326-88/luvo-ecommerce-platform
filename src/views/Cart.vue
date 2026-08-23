<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">購物車</h1>

      <!-- 空購物車狀態 -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p class="text-gray-500 text-lg mb-6">購物車目前是空的</p>
        <BaseButton variant="primary" @click="router.push('/')">
          去逛逛商品
        </BaseButton>
      </div>

      <!-- 購物車內容 -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 商品清單 -->
        <div class="lg:col-span-2 space-y-4">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.lineId"
            :item="item"
            :removing="removingLineId === item.lineId"
            @update:quantity="handleUpdateQuantity"
            @remove-request="openRemoveModal"
          />
        </div>

        <!-- 訂單摘要 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 class="text-xl font-bold text-gray-800 mb-4">訂單摘要</h2>

            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>商品小計（{{ cartStore.totalItems }} 件）</span>
                <span>NT$ {{ formatPrice(cartStore.totalAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span>運費</span>
                <span v-if="shippingFee === 0" class="text-green-600 font-medium">
                  免運費
                </span>
                <span v-else>NT$ {{ formatPrice(shippingFee) }}</span>
              </div>
              <p v-if="shippingFee > 0" class="text-xs text-gray-400">
                滿 NT$ {{ formatPrice(FREE_SHIPPING_THRESHOLD) }} 免運，還差
                NT$ {{ formatPrice(FREE_SHIPPING_THRESHOLD - cartStore.totalAmount) }}
              </p>
            </div>

            <div class="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span class="text-base font-bold text-gray-800">合計</span>
              <span class="text-2xl font-bold text-amber-800">
                NT$ {{ formatPrice(grandTotal) }}
              </span>
            </div>

            <BaseButton
              variant="primary"
              block
              class="mt-6"
              @click="router.push('/checkout')"
            >
              前往結帳
            </BaseButton>

            <router-link
              to="/"
              class="block text-center text-sm text-gray-500 hover:text-amber-800 mt-4 transition-colors"
            >
              繼續購物
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 移除商品確認 Modal -->
    <BaseModal
      v-model="showRemoveModal"
      title="移除商品"
      size="sm"
      @confirm="confirmRemove"
    >
      <p class="text-gray-600">
        確定要將「{{ pendingRemoveItem?.name }}」從購物車移除嗎？
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
import CartItem from "@/components/business/CartItem.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/utils/helpers";

const router = useRouter();
const cartStore = useCartStore();

const FREE_SHIPPING_THRESHOLD = 3000;
const FLAT_SHIPPING_FEE = 100;

const shippingFee = computed(() => {
  if (cartStore.items.length === 0) return 0;
  return cartStore.totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
});

const grandTotal = computed(() => cartStore.totalAmount + shippingFee.value);

// 數量更新：直接交給 cartStore 處理
const handleUpdateQuantity = ({ id, quantity }) => {
  const target = cartStore.items.find((item) => item.id === id);
  if (target) {
    cartStore.updateQuantity({ lineId: target.lineId, quantity });
  }
};

// 移除商品：CartItem 只 emit 意圖，這裡用 BaseModal 二次確認後才真的執行
const showRemoveModal = ref(false);
const pendingRemoveItem = ref(null);
const removingLineId = ref(null);

const openRemoveModal = (item) => {
  pendingRemoveItem.value = item;
  showRemoveModal.value = true;
};

const confirmRemove = () => {
  if (!pendingRemoveItem.value) return;
  removingLineId.value = pendingRemoveItem.value.lineId;
  cartStore.removeItem({ lineId: pendingRemoveItem.value.lineId });
  showToast(`已移除「${pendingRemoveItem.value.name}」`);
  removingLineId.value = null;
  pendingRemoveItem.value = null;
  showRemoveModal.value = false;
};

const toastMessage = ref("");
let toastTimer = null;
const showToast = (message) => {
  toastMessage.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
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