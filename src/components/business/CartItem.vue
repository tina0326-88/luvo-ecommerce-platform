<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- 商品圖片 -->
      <div class="flex-shrink-0">
        <router-link :to="`/products/detail/${item.id}`">
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full sm:w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
          />
        </router-link>
      </div>

      <!-- 商品資訊 -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <!-- 商品名稱 -->
            <router-link
              :to="`/products/detail/${item.id}`"
              class="text-base font-medium text-gray-900 hover:text-amber-800 transition-colors line-clamp-2"
            >
              {{ item.name }}
            </router-link>

            <!-- 商品規格 -->
            <div class="mt-2 text-sm text-gray-600 space-y-1">
              <div v-if="item.size">
                <span class="font-medium">尺寸：</span>
                <span>{{ item.size }}</span>
              </div>
              <div v-if="item.color">
                <span class="font-medium">顏色：</span>
                <span>{{ item.color }}</span>
              </div>
            </div>

            <!-- 價格（手機版顯示） -->
            <div class="mt-2 sm:hidden">
              <div class="flex items-center gap-2">
                <span class="text-xl font-bold text-amber-800">
                  NT$ {{ formatPrice(item.price) }}
                </span>
                <span
                  v-if="item.originalPrice && item.originalPrice > item.price"
                  class="text-sm text-gray-500 line-through"
                >
                  NT$ {{ formatPrice(item.originalPrice) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 移除按鈕：不在元件內部彈 confirm，只負責發出意圖 -->
          <button
            @click="$emit('remove-request', item)"
            :disabled="removing"
            class="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :aria-label="`移除 ${item.name}`"
          >
            <svg
              v-if="!removing"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>
        </div>

        <!-- 數量與價格（桌面版） -->
        <div class="hidden sm:flex items-center justify-between mt-4">
          <!-- 數量選擇器 -->
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button
              @click="handleDecrement"
              :disabled="item.quantity <= 1"
              aria-label="減少數量"
              class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>

            <input
              type="text"
              inputmode="numeric"
              :value="tempQuantity"
              @input="handleQuantityInput"
              @blur="handleQuantityBlur"
              class="w-12 text-center border-x border-gray-300 focus:outline-none"
              :aria-label="`${item.name} 數量`"
            />

            <button
              @click="handleIncrement"
              :disabled="item.quantity >= maxQuantity"
              aria-label="增加數量"
              class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <!-- 價格 -->
          <div class="text-right">
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold text-amber-800">
                NT$ {{ formatPrice(item.price * item.quantity) }}
              </span>
              <span
                v-if="item.originalPrice && item.originalPrice > item.price"
                class="text-sm text-gray-500 line-through"
              >
                NT$ {{ formatPrice(item.originalPrice * item.quantity) }}
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              單價 NT$ {{ formatPrice(item.price) }}
            </div>
          </div>
        </div>

        <!-- 數量選擇器（手機版） -->
        <div class="flex sm:hidden items-center justify-between mt-4">
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button
              @click="handleDecrement"
              :disabled="item.quantity <= 1"
              aria-label="減少數量"
              class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>

            <input
              type="text"
              inputmode="numeric"
              :value="tempQuantity"
              @input="handleQuantityInput"
              @blur="handleQuantityBlur"
              class="w-12 text-center border-x border-gray-300 focus:outline-none"
              :aria-label="`${item.name} 數量`"
            />

            <button
              @click="handleIncrement"
              :disabled="item.quantity >= maxQuantity"
              aria-label="增加數量"
              class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div class="text-right">
            <div class="text-lg font-bold text-amber-800">
              NT$ {{ formatPrice(item.price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- 庫存警告 -->
        <div v-if="item.stock !== undefined && item.stock < 5" class="mt-2">
          <span class="text-xs text-red-600">
            ⚠️ 僅剩 {{ item.stock }} 件
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.id !== undefined &&
        value.name !== undefined &&
        value.price !== undefined &&
        value.quantity !== undefined
      );
    },
  },
  maxQuantity: {
    type: Number,
    default: 99,
  },
  // 由父層控制，該筆商品正在被移除時顯示 loading，避免連點造成重複請求
  removing: {
    type: Boolean,
    default: false,
  },
});

// update:quantity 用於數量變更；remove-request 只發出「使用者想移除」的意圖，
// 實際確認與刪除交給父層（搭配 BaseModal）處理，元件本身不彈原生 confirm()
const emit = defineEmits(["update:quantity", "remove-request"]);

const tempQuantity = ref(props.item.quantity);

// 監聽 item.quantity 變化（例如父層因庫存調整而改動）
watch(
  () => props.item.quantity,
  (newVal) => {
    tempQuantity.value = newVal;
  }
);

// 增加數量
const handleIncrement = () => {
  if (props.item.quantity < props.maxQuantity) {
    const newQuantity = props.item.quantity + 1;
    emit("update:quantity", { id: props.item.id, quantity: newQuantity });
  }
};

// 減少數量
const handleDecrement = () => {
  if (props.item.quantity > 1) {
    const newQuantity = props.item.quantity - 1;
    emit("update:quantity", { id: props.item.id, quantity: newQuantity });
  }
};

// 手動輸入數量：輸入當下直接反映在畫面上（修正原本輸入框綁定 prop 導致打字沒反應的問題）
const handleQuantityInput = (event) => {
  const value = event.target.value;
  if (/^\d*$/.test(value)) {
    tempQuantity.value = value;
  } else {
    event.target.value = tempQuantity.value;
  }
};

// 失去焦點時驗證並更新數量
const handleQuantityBlur = () => {
  let value = parseInt(tempQuantity.value, 10) || 1;

  if (value < 1) {
    value = 1;
  } else if (value > props.maxQuantity) {
    value = props.maxQuantity;
  }

  tempQuantity.value = value;

  if (value !== props.item.quantity) {
    emit("update:quantity", { id: props.item.id, quantity: value });
  }
};

// 建議之後移到 utils/helpers.js 統一管理，這裡先就地實作方便直接複製貼上
const formatPrice = (price) => {
  return (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>