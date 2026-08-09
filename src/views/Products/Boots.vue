<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面橫幅 -->
    <div class="relative h-96 overflow-hidden">
      <img
        src="/images/luvo-leather-shoes-1.jpg"
        alt="靴子系列"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <h1 class="text-6xl font-bold mb-4">靴子系列</h1>
          <p class="text-2xl">堅固耐用，展現硬派風格與個性魅力</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- 篩選和排序 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >款式</label
            >
            <select
              v-model="filterStyle"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部款式</option>
              <option value="chelsea">切爾西靴</option>
              <option value="martin">馬丁靴</option>
              <option value="chukka">沙漠靴</option>
              <option value="work">工裝靴</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >顏色</label
            >
            <select
              v-model="filterColor"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部顏色</option>
              <option value="black">黑色</option>
              <option value="brown">棕色</option>
              <option value="tan">淺棕</option>
              <option value="gray">灰色</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >價格區間</label
            >
            <select
              v-model="filterPrice"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部價格</option>
              <option value="0-6000">NT$ 6,000 以下</option>
              <option value="6000-9000">NT$ 6,000 - 9,000</option>
              <option value="9000-12000">NT$ 9,000 - 12,000</option>
              <option value="12000+">NT$ 12,000 以上</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >排序</label
            >
            <select
              v-model="sortBy"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="default">預設排序</option>
              <option value="price-low">價格：低到高</option>
              <option value="price-high">價格：高到低</option>
              <option value="newest">最新上架</option>
              <option value="popular">最受歡迎</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :is-favorited="userStore.isFavorited(product.id)"
          :adding="addingId === product.id"
          @add-to-cart="handleAddToCart"
          @toggle-favorite="(p) => userStore.toggleFavorite(p.id)"
          @quick-view="handleQuickView"
        />
      </div>

      <!-- 空狀態 -->
      <div v-if="filteredProducts.length === 0" class="text-center py-16">
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
        <p class="text-gray-500 text-lg">找不到符合條件的商品</p>
      </div>
    </div>

    <!-- 加入購物車提示 Toast -->
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
import { computed } from "vue";
import ProductCard from "@/components/business/ProductCard.vue";
import { useCartStore } from "@/stores/useCartStore";
import { useUserStore } from "@/stores/useUserStore";
import { useProductStore } from "@/stores/useProductStore";

const cartStore = useCartStore();
const userStore = useUserStore();
const productStore = useProductStore();

const products = computed(() => productStore.getProductsByCategory("boots"));

const filterStyle = ref("");
const filterColor = ref("");
const filterPrice = ref("");
const sortBy = ref("default");

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

const filteredProducts = computed(() => {
  let result = products.value;

  if (filterStyle.value) {
    result = result.filter((p) => p.style === filterStyle.value);
  }

  if (filterColor.value) {
    result = result.filter((p) => p.color === filterColor.value);
  }

  if (filterPrice.value) {
    const [min, max] = filterPrice.value
      .split("-")
      .map((v) => (v === "+" ? Infinity : parseInt(v)));
    result = result.filter((p) => {
      if (max === undefined) return p.price >= min;
      return p.price >= min && p.price <= max;
    });
  }

  if (sortBy.value === "price-low") {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-high") {
    result = [...result].sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "newest") {
    result = [...result].sort((a, b) => b.isNew - a.isNew);
  } else if (sortBy.value === "popular") {
    result = [...result].sort((a, b) => b.reviews - a.reviews);
  }

  return result;
});

const handleAddToCart = async (product) => {
  if (product.stock === 0) return;

  addingId.value = product.id;
  await new Promise((resolve) => setTimeout(resolve, 400));

  cartStore.addItem(product);
  showToast(`已將「${product.name}」加入購物車`);
  addingId.value = null;
};

const handleQuickView = (product) => {
  console.log("quick view", product);
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