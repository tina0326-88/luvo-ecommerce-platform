<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">收藏清單</h1>

      <div
        v-if="favoriteProducts.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in favoriteProducts"
          :key="product.id"
          :product="product"
          :is-favorited="true"
          :adding="addingId === product.id"
          @add-to-cart="handleAddToCart"
          @toggle-favorite="(p) => userStore.toggleFavorite(p.id)"
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <p class="text-gray-500 text-lg mb-6">還沒有收藏任何商品</p>
        <BaseButton variant="primary" @click="router.push('/')"
          >去逛逛商品</BaseButton
        >
      </div>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/business/ProductCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { useUserStore } from "@/stores/useUserStore";
import { useCartStore } from "@/stores/useCartStore";
import { useProductStore } from "@/stores/useProductStore";

const router = useRouter();
const userStore = useUserStore();
const cartStore = useCartStore();
const productStore = useProductStore();

const favoriteProducts = computed(() => {
  return userStore.favorites
    .map((id) => productStore.getProductById(id))
    .filter((product) => product !== null);
});

const addingId = ref(null);
const toastMessage = ref("");
let toastTimer = null;
const showToast = (message) => {
  toastMessage.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
};

const handleAddToCart = async (product) => {
  if (product.stock === 0) return;
  addingId.value = product.id;
  await new Promise((resolve) => setTimeout(resolve, 400));
  cartStore.addItem(product);
  showToast(`已將「${product.name}」加入購物車`);
  addingId.value = null;
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
