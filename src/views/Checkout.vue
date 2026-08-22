<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">
        {{ isPayingExistingOrder ? "訂單付款" : "結帳" }}
      </h1>

      <!-- 購物車為空且不是在付舊訂單時，導回購物車 -->
      <div
        v-if="!isPayingExistingOrder && cartStore.items.length === 0"
        class="text-center py-24"
      >
        <p class="text-gray-500 text-lg mb-6">購物車是空的，無法進行結帳</p>
        <BaseButton variant="primary" @click="router.push('/cart')"
          >回購物車</BaseButton
        >
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左側：收件資訊 + 商品明細 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 收件地址（付舊訂單時不需要重選地址，只需要付款） -->
          <div
            v-if="!isPayingExistingOrder"
            class="bg-white rounded-xl shadow-md p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">收件地址</h2>
              <router-link
                to="/user/addresses"
                class="text-sm text-amber-800 hover:underline"
              >
                管理地址
              </router-link>
            </div>

            <div
              v-if="userStore.addresses.length === 0"
              class="text-sm text-gray-500"
            >
              尚未新增收件地址，請先
              <router-link
                to="/user/addresses"
                class="text-amber-800 hover:underline"
              >
                新增地址
              </router-link>
            </div>

            <div v-else class="space-y-3">
              <label
                v-for="address in userStore.addresses"
                :key="address.id"
                class="flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors"
                :class="
                  selectedAddressId === address.id
                    ? 'border-amber-800 bg-amber-50'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  :value="address.id"
                  v-model="selectedAddressId"
                  class="mt-1 accent-amber-800"
                />
                <div class="text-sm">
                  <p class="font-medium text-gray-800">
                    {{ address.recipient }}
                    <span
                      v-if="address.isDefault"
                      class="text-xs text-amber-800 ml-1"
                      >（預設）</span
                    >
                  </p>
                  <p class="text-gray-600">{{ address.phone }}</p>
                  <p class="text-gray-600">
                    {{ address.city }}{{ address.district }}{{ address.detail }}
                  </p>
                </div>
              </label>
            </div>

            <p v-if="errors.address" class="mt-2 text-sm text-red-600">
              {{ errors.address }}
            </p>
          </div>

          <!-- 商品明細 -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">商品明細</h2>
            <div class="divide-y divide-gray-100">
              <div
                v-for="item in checkoutItems"
                :key="item.lineId || item.id"
                class="flex items-center gap-4 py-3"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 line-clamp-1">
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    數量：{{ item.quantity }}
                  </p>
                </div>
                <p class="text-sm font-bold text-amber-800">
                  NT$ {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>
          </div>

          <!-- 付款方式 -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">付款方式</h2>
            <div class="space-y-2">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors"
                :class="
                  selectedPayment === method.value
                    ? 'border-amber-800 bg-amber-50'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  :value="method.value"
                  v-model="selectedPayment"
                  class="accent-amber-800"
                />
                <span class="text-sm text-gray-700">{{ method.label }}</span>
              </label>
            </div>
            <p class="text-xs text-gray-400 mt-3">
              本專案未串接真實金流，付款僅為展示流程，不會產生實際扣款。
            </p>
          </div>
        </div>

        <!-- 右側：金額摘要 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 class="text-lg font-bold text-gray-800 mb-4">訂單摘要</h2>

            <!-- 優惠券選擇（付舊訂單時不重複套用優惠券） -->
            <div v-if="!isPayingExistingOrder" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >優惠券</label
              >
              <select
                v-model="selectedCouponId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option :value="null">不使用優惠券</option>
                <option
                  v-for="coupon in usableCoupons"
                  :key="coupon.id"
                  :value="coupon.id"
                >
                  {{ coupon.title }}
                </option>
              </select>
              <p
                v-if="selectedCoupon && itemsSubtotal < selectedCoupon.minSpend"
                class="mt-1 text-xs text-red-600"
              >
                未達使用門檻（滿 NT$
                {{ formatPrice(selectedCoupon.minSpend) }}）
              </p>
            </div>

            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>商品小計</span>
                <span>NT$ {{ formatPrice(itemsSubtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>運費</span>
                <span
                  v-if="shippingFee === 0"
                  class="text-green-600 font-medium"
                  >免運費</span
                >
                <span v-else>NT$ {{ formatPrice(shippingFee) }}</span>
              </div>
              <div
                v-if="couponDiscount > 0"
                class="flex justify-between text-amber-800"
              >
                <span>優惠券折抵</span>
                <span>− NT$ {{ formatPrice(couponDiscount) }}</span>
              </div>
            </div>

            <div
              class="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center"
            >
              <span class="text-base font-bold text-gray-800">應付金額</span>
              <span class="text-2xl font-bold text-amber-800">
                NT$ {{ formatPrice(grandTotal) }}
              </span>
            </div>

            <p v-if="errors.submit" class="mt-3 text-sm text-red-600">
              {{ errors.submit }}
            </p>

            <BaseButton
              variant="primary"
              block
              class="mt-6"
              :loading="submitting"
              @click="handleSubmit"
            >
              {{ isPayingExistingOrder ? "確認付款" : "確認送出訂單" }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import { useCartStore } from "@/stores/useCartStore";
import { useUserStore } from "@/stores/useUserStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice } from "@/utils/helpers";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from "@/utils/constants";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const orderStore = useOrderStore();

// 情境判斷：從 Orders.vue「前往付款」導來的既有訂單，還是一般購物車結帳
const existingOrder = computed(() => {
  if (!route.query.orderId) return null;
  return orderStore.getOrderById(route.query.orderId);
});
const isPayingExistingOrder = computed(() => existingOrder.value !== null);

// 要結帳的商品清單：既有訂單用訂單裡的品項，否則用購物車內容
const checkoutItems = computed(() => {
  if (isPayingExistingOrder.value) return existingOrder.value.items;
  return cartStore.items;
});

const itemsSubtotal = computed(() => {
  if (isPayingExistingOrder.value) return existingOrder.value.totalAmount;
  return cartStore.totalAmount;
});

// 地址選擇：預設選中已標記為預設的地址
const selectedAddressId = ref(
  userStore.addresses.find((a) => a.isDefault)?.id ??
    userStore.addresses[0]?.id ??
    null,
);

// 付款方式
const paymentMethods = [
  { value: "credit-card", label: "信用卡付款" },
  { value: "cod", label: "貨到付款" },
  { value: "atm", label: "ATM 轉帳" },
];
const selectedPayment = ref("credit-card");

// 優惠券：只顯示可使用（未使用且未過期）的券
const usableCoupons = computed(() => userStore.availableCoupons);
const selectedCouponId = ref(null);
const selectedCoupon = computed(
  () =>
    usableCoupons.value.find((c) => c.id === selectedCouponId.value) || null,
);

const couponDiscount = computed(() => {
  const coupon = selectedCoupon.value;
  if (!coupon || itemsSubtotal.value < coupon.minSpend) return 0;

  if (coupon.type === "cash") return coupon.discountValue;
  if (coupon.type === "percent") {
    return Math.round(itemsSubtotal.value * (coupon.discountValue / 100));
  }
  return 0; // 免運券不折抵商品金額，改在運費計算時處理
});

const shippingFee = computed(() => {
  if (checkoutItems.value.length === 0) return 0;

  const freeByCoupon =
    selectedCoupon.value?.type === "shipping" &&
    itemsSubtotal.value >= selectedCoupon.value.minSpend;

  if (freeByCoupon) return 0;
  return itemsSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
});

const grandTotal = computed(() => {
  return Math.max(
    0,
    itemsSubtotal.value + shippingFee.value - couponDiscount.value,
  );
});

const submitting = ref(false);
const errors = ref({ address: "", submit: "" });

const validate = () => {
  errors.value = { address: "", submit: "" };

  if (!isPayingExistingOrder.value && !selectedAddressId.value) {
    errors.value.address = "請選擇或新增一筆收件地址";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;

  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (isPayingExistingOrder.value) {
    // 既有待付款訂單：付款成功後轉為處理中
    orderStore.updateStatus(existingOrder.value.id, "processing");
    submitting.value = false;
    router.push({ name: "Orders" });
    return;
  }

  // 一般購物車結帳：建立新訂單
  const newOrder = orderStore.createOrder({
    items: cartStore.items.map((item) => ({
      id: item.id,
      productId: item.id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: grandTotal.value,
  });

  if (selectedCoupon.value) {
    userStore.useCoupon(selectedCoupon.value.id);
  }

  cartStore.clearCart();
  submitting.value = false;

  router.push({ name: "Orders", query: { justOrdered: newOrder.orderNumber } });
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
