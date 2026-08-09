<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="product" class="container mx-auto px-4 py-12">
      <!-- 麵包屑 -->
      <nav class="text-sm text-gray-500 mb-6">
        <router-link to="/" class="hover:text-amber-800">首頁</router-link>
        <span class="mx-2">/</span>
        <router-link
          :to="categoryPath"
          class="hover:text-amber-800"
        >
          {{ productStore.categoryLabels[product.category] }}
        </router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-700">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- 商品圖片 -->
        <div class="aspect-square rounded-xl overflow-hidden bg-white shadow-md">
          <img
            :src="imageSrc"
            :alt="product.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- 商品資訊 -->
        <div>
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="product.isNew" class="bg-red-600 text-white text-xs px-2 py-1 rounded">NEW</span>
            <span v-if="product.discount" class="bg-yellow-500 text-white text-xs px-2 py-1 rounded">-{{ product.discount }}%</span>
            <span v-if="product.waterproof" class="bg-blue-500 text-white text-xs px-2 py-1 rounded">防水</span>
            <span v-if="product.isHot" class="bg-orange-500 text-white text-xs px-2 py-1 rounded">HOT</span>
          </div>

          <h1 class="text-3xl font-bold text-gray-800 mb-3">{{ product.name }}</h1>

          <div class="flex items-center gap-2 mb-4">
            <span class="text-sm font-medium text-gray-700">{{ product.rating || 0 }} 分</span>
            <span class="text-sm text-gray-500">（{{ product.reviews || 0 }} 則評價）</span>
          </div>

          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl font-bold text-amber-800">NT$ {{ formatPrice(finalPrice) }}</span>
            <span
              v-if="product.discount"
              class="text-lg text-gray-400 line-through"
            >
              NT$ {{ formatPrice(product.price) }}
            </span>
          </div>

          <p v-if="product.material" class="text-gray-600 mb-2">
            <span class="font-medium">材質：</span>{{ product.material }}
          </p>
          <p v-if="product.color" class="text-gray-600 mb-4">
            <span class="font-medium">顏色：</span>{{ product.color }}
          </p>

          <div
            v-if="product.features && product.features.length"
            class="flex flex-wrap gap-2 mb-6"
          >
            <span
              v-for="feature in product.features"
              :key="feature"
              class="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
            >
              {{ feature }}
            </span>
          </div>

          <!-- 數量選擇 -->
          <div class="flex items-center gap-4 mb-6">
            <span class="text-sm text-gray-700 font-medium">數量</span>
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button
                @click="quantity > 1 && quantity--"
                :disabled="quantity <= 1"
                aria-label="減少數量"
                class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span class="w-12 text-center">{{ quantity }}</span>
              <button
                @click="quantity < 10 && quantity++"
                :disabled="quantity >= 10 || product.stock === 0"
                aria-label="增加數量"
                class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span v-if="product.stock > 0 && product.stock < 5" class="text-sm text-red-600">
              ⚠️ 僅剩 {{ product.stock }} 件
            </span>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex gap-3">
            <BaseButton
              variant="primary"
              size="lg"
              :disabled="product.stock === 0"
              :loading="adding"
              class="flex-1"
              @click="handleAddToCart"
            >
              {{ product.stock === 0 ? "已售完" : "加入購物車" }}
            </BaseButton>
            <BaseButton
              variant="outline"
              size="lg"
              :aria-label="isFavorited ? '取消收藏' : '收藏'"
              @click="userStore.toggleFavorite(product.id)"
            >
              {{ isFavorited ? "已收藏" : "收藏" }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 相關推薦 -->
      <div v-if="relatedProducts.length" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">相關推薦</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProductCard
            v-for="related in relatedProducts"
            :key="related.id"
            :product="related"
            :is-favorited="userStore.isFavorited(related.id)"
            :adding="false"
            @add-to-cart="cartStore.addItem($event)"
            @toggle-favorite="(p) => userStore.toggleFavorite(p.id)"
          />
        </div>
      </div>
    </div>

    <!-- 找不到商品 -->
    <div v-else class="container mx-auto px-4 py-24 text-center">
      <p class="text-gray-500 text-lg mb-6">找不到這件商品，可能已經下架</p>
      <BaseButton variant="primary" @click="router.push('/')">回首頁</BaseButton>
    </div>

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
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";
import ProductCard from "@/components/business/ProductCard.vue";
import { useProductStore } from "@/stores/useProductStore";
import { useCartStore } from "@/stores/useCartStore";
import { useUserStore } from "@/stores/useUserStore";
import { formatPrice } from "@/utils/helpers";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const userStore = useUserStore();

const product = computed(() => productStore.getProductById(route.params.id));
const relatedProducts = computed(() =>
  productStore.getRelatedProducts(product.value)
);
const categoryPath = computed(() =>
  product.value ? `/products/${product.value.category}` : "/"
);
const isFavorited = computed(() =>
  product.value ? userStore.isFavorited(product.value.id) : false
);

const finalPrice = computed(() => {
  if (!product.value) return 0;
  if (product.value.discount) {
    return Math.round(product.value.price * (1 - product.value.discount / 100));
  }
  return product.value.price;
});

const quantity = ref(1);
const adding = ref(false);
const imageFailed = ref(false);

// 切換到不同商品時重置數量與圖片錯誤狀態
watch(product, () => {
  quantity.value = 1;
  imageFailed.value = false;
});

const imageSrc = computed(() => {
  if (imageFailed.value || !product.value) return "/images/placeholder.jpg";
  return product.value.image || `/images/product-${product.value.id}.jpg`;
});

const handleImageError = () => {
  imageFailed.value = true;
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

const handleAddToCart = async () => {
  if (!product.value || product.value.stock === 0) return;

  adding.value = true;
  await new Promise((resolve) => setTimeout(resolve, 400));

  cartStore.addItem(product.value, quantity.value);
  showToast(`已將「${product.value.name}」x${quantity.value} 加入購物車`);
  adding.value = false;
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