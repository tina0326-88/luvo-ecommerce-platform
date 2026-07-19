<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
  >
    <!-- 商品圖片區 -->
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        :src="imageSrc"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        @error="handleImageError"
      />

      <!-- Hover 遮罩和快速操作 -->
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <div class="flex gap-2">
          <!-- 快速查看 -->
          <button
            @click.prevent="$emit('quick-view', product)"
            class="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-amber-800 hover:text-white transition-colors shadow-lg text-sm font-medium"
            aria-label="快速查看商品"
          >
            快速查看
          </button>

          <!-- 加入收藏：收藏狀態由父層透過 prop 傳入，跟收藏列表頁共用同一份資料來源 -->
          <button
            @click.prevent="$emit('toggle-favorite', product)"
            :class="[
              'px-4 py-2 rounded-full transition-colors shadow-lg text-sm font-medium',
              isFavorited
                ? 'bg-amber-800 text-white'
                : 'bg-white text-gray-800 hover:bg-amber-800 hover:text-white',
            ]"
            :aria-label="isFavorited ? `取消收藏 ${product.name}` : `收藏 ${product.name}`"
          >
            {{ isFavorited ? "已收藏" : "收藏" }}
          </button>
        </div>
      </div>

      <!-- 標籤 -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span
          v-if="product.isNew"
          class="bg-red-600 text-white text-xs px-2 py-1 rounded"
        >
          NEW
        </span>
        <span
          v-if="product.discount"
          class="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
        >
          -{{ product.discount }}%
        </span>
        <span
          v-if="product.stock === 0"
          class="bg-gray-800 text-white text-xs px-2 py-1 rounded"
        >
          售完
        </span>
      </div>
    </div>

    <!-- 商品資訊區 -->
    <router-link
      :to="`/products/detail/${product.id}`"
      class="block p-4 hover:bg-gray-50 transition-colors"
    >
      <!-- 商品名稱 -->
      <h3
        class="text-base font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-800 transition-colors"
      >
        {{ product.name }}
      </h3>

      <!-- 評分：欄位名稱對齊商品列表頁（rating / reviews） -->
      <div class="flex items-center gap-2 mb-2">
        <div class="flex items-center gap-1">
          <span class="text-sm font-medium text-gray-700">
            {{ product.rating || 0 }}
          </span>
          <span class="text-sm text-gray-500">分</span>
        </div>
        <span class="text-sm text-gray-500">
          ({{ product.reviews || 0 }} 則評價)
        </span>
      </div>

      <!-- 價格 -->
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold text-amber-800">
          NT$ {{ formatPrice(finalPrice) }}
        </span>
        <span
          v-if="product.discount"
          class="text-sm text-gray-400 line-through"
        >
          NT$ {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- 顏色：商品資料目前是單一字串（color），不是陣列，先以文字呈現 -->
      <div v-if="product.color" class="mt-3">
        <span class="text-xs text-gray-500">顏色：{{ product.color }}</span>
      </div>
    </router-link>

    <!-- 加入購物車按鈕：loading 狀態由父層透過 adding prop 控制，避免連點造成重複請求 -->
    <div class="px-4 pb-4">
      <BaseButton
        @click="$emit('add-to-cart', product)"
        :disabled="product.stock === 0"
        :loading="adding"
        block
        size="sm"
      >
        {{ product.stock === 0 ? "已售完" : "加入購物車" }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseButton from "../base/BaseButton.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  // 是否已收藏，由父層維護（跟 Boots/CasualShoes/LeatherShoes 的收藏邏輯共用同一份資料）
  isFavorited: {
    type: Boolean,
    default: false,
  },
  // 是否正在加入購物車中，由父層控制
  adding: {
    type: Boolean,
    default: false,
  },
});

// 元件保持「笨」：只負責顯示與發出使用者意圖，不直接呼叫 Pinia store，
// 實際加入購物車 / 收藏的邏輯統一由父層處理，跟 CartItem、OrderItem 架構一致
defineEmits(["quick-view", "add-to-cart", "toggle-favorite"]);

// 圖片載入失敗後的實際位址（取代原本打不到的 v-else 死程式碼）
const imageFailed = ref(false);

const imageSrc = computed(() => {
  if (imageFailed.value) {
    return "/images/placeholder.jpg";
  }
  return props.product.image || `/images/product-${props.product.id}.jpg`;
});

const handleImageError = () => {
  if (!imageFailed.value) {
    imageFailed.value = true;
  }
};

// 計算最終價格，四捨五入避免出現角、分
const finalPrice = computed(() => {
  if (props.product.discount) {
    return Math.round(props.product.price * (1 - props.product.discount / 100));
  }
  return props.product.price;
});

// 跟商品列表頁、CartItem、OrderItem 統一的格式化方式
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