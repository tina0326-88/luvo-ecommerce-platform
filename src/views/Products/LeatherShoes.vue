<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面橫幅 -->
    <div class="relative h-96 overflow-hidden">
      <img
        src="/images/luvo-leather-shoes-1.jpg"
        alt="皮鞋系列"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <h1 class="text-6xl font-bold mb-4">皮鞋系列</h1>
          <p class="text-2xl">工藝與品味的極致展現，每一步都是自信</p>
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
              <option value="oxford">牛津鞋</option>
              <option value="derby">德比鞋</option>
              <option value="loafer">樂福鞋</option>
              <option value="monk">孟克鞋</option>
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
              <option value="burgundy">酒紅</option>
              <option value="tan">淺棕</option>
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
              <option value="0-5000">NT$ 5,000 以下</option>
              <option value="5000-8000">NT$ 5,000 - 8,000</option>
              <option value="8000-12000">NT$ 8,000 - 12,000</option>
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
        <router-link
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/products/detail/${product.id}`"
          class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group block"
        >
          <div class="relative aspect-square overflow-hidden bg-gray-200">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span
                v-if="product.isNew"
                class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                NEW
              </span>
              <span
                v-if="product.discount"
                class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
              >
                -{{ product.discount }}%
              </span>
            </div>
            <button
              @click.stop.prevent="toggleFavorite(product.id)"
              :aria-label="isFavorite(product.id) ? `取消收藏 ${product.name}` : `收藏 ${product.name}`"
              class="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                class="w-5 h-5"
                :class="
                  isFavorite(product.id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400'
                "
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
            </button>
          </div>

          <div class="p-4">
            <div class="mb-2">
              <span class="text-xs text-gray-500">{{
                getStyleText(product.style)
              }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>
            <div class="flex items-center gap-2 mb-3">
              <div class="flex gap-1">
                <span v-for="i in 5" :key="i" class="text-yellow-400">
                  <svg
                    class="w-4 h-4"
                    :class="i <= product.rating ? 'fill-current' : ''"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </span>
              </div>
              <span class="text-xs text-gray-500">({{ product.reviews }})</span>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ product.material }}</p>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-2xl font-bold text-amber-800">
                  NT$ {{ formatPrice(product.price) }}
                </p>
                <p
                  v-if="product.originalPrice"
                  class="text-sm text-gray-400 line-through"
                >
                  NT$ {{ formatPrice(product.originalPrice) }}
                </p>
              </div>
            </div>
            <button
              @click.stop.prevent="addToCart(product)"
              class="w-full mt-4 px-4 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium"
            >
              加入購物車
            </button>
          </div>
        </router-link>
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
import { ref, computed, onMounted } from "vue";

const products = ref([
  {
    id: 1,
    name: "紳士格調經典牛津皮鞋",
    price: 6980,
    originalPrice: 7980,
    style: "oxford",
    color: "black",
    material: "頭層牛皮",
    rating: 5,
    reviews: 156,
    image: "/images/product-1.jpg",
    isNew: false,
    discount: 13,
  },
  {
    id: 2,
    name: "摩登時尚簡約牛津皮鞋",
    price: 4980,
    originalPrice: null,
    style: "oxford",
    color: "brown",
    material: "頭層牛皮",
    rating: 4,
    reviews: 134,
    image: "/images/product-2.jpg",
    isNew: true,
    discount: 0,
  },
  {
    id: 3,
    name: "復古風範雕花牛津皮鞋",
    price: 7980,
    originalPrice: 8980,
    style: "oxford",
    color: "burgundy",
    material: "頭層牛皮 + 手工雕花",
    rating: 5,
    reviews: 98,
    image: "/images/product-3.jpg",
    isNew: true,
    discount: 11,
  },
  {
    id: 4,
    name: "商務精英德比皮鞋",
    price: 5980,
    originalPrice: null,
    style: "derby",
    color: "black",
    material: "頭層牛皮",
    rating: 4,
    reviews: 87,
    image: "/images/product-4.jpg",
    isNew: false,
    discount: 0,
  },
  {
    id: 5,
    name: "都會型男樂福鞋",
    price: 5400,
    originalPrice: null,
    style: "loafer",
    color: "brown",
    material: "小牛皮",
    rating: 5,
    reviews: 76,
    image: "/images/product-5.jpg",
    isNew: true,
    discount: 0,
  },
  {
    id: 6,
    name: "義式經典樂福鞋",
    price: 8800,
    originalPrice: 9800,
    style: "loafer",
    color: "tan",
    material: "義大利進口小牛皮",
    rating: 5,
    reviews: 112,
    image: "/images/product-6.jpg",
    isNew: false,
    discount: 10,
  },
  {
    id: 7,
    name: "雙扣孟克鞋",
    price: 7680,
    originalPrice: null,
    style: "monk",
    color: "brown",
    material: "頭層牛皮",
    rating: 4,
    reviews: 64,
    image: "/images/product-7.jpg",
    isNew: true,
    discount: 0,
  },
  {
    id: 8,
    name: "紳士雕花德比鞋",
    price: 6780,
    originalPrice: 7580,
    style: "derby",
    color: "burgundy",
    material: "頭層牛皮 + 雕花",
    rating: 5,
    reviews: 89,
    image: "/images/product-8.jpg",
    isNew: false,
    discount: 11,
  },
  {
    id: 9,
    name: "時尚尖頭牛津鞋",
    price: 5880,
    originalPrice: null,
    style: "oxford",
    color: "black",
    material: "漆皮",
    rating: 4,
    reviews: 45,
    image: "/images/product-9.jpg",
    isNew: true,
    discount: 0,
  },
]);

const filterStyle = ref("");
const filterColor = ref("");
const filterPrice = ref("");
const sortBy = ref("default");

// 收藏清單改用 localStorage，跨頁面 / 重新整理都會保留
const FAVORITES_KEY = "luvo-favorites";
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
const favorites = ref(loadFavorites());

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

const getStyleText = (style) => {
  const styles = {
    oxford: "牛津鞋",
    derby: "德比鞋",
    loafer: "樂福鞋",
    monk: "孟克鞋",
  };
  return styles[style] || style;
};

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const isFavorite = (id) => {
  return favorites.value.includes(id);
};

const toggleFavorite = (id) => {
  const index = favorites.value.indexOf(id);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(id);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value));
};

const addToCart = (product) => {
  showToast(`已將「${product.name}」加入購物車`);
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