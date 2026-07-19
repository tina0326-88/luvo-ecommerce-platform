<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面橫幅 -->
    <div class="relative h-96 overflow-hidden">
      <img
        src="/images/luvo-leather-shoes-1.jpg"
        alt="休閒鞋系列"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <h1 class="text-6xl font-bold mb-4">休閒鞋系列</h1>
          <p class="text-2xl">舒適自在，打造輕鬆時尚的日常穿搭</p>
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
              <option value="sneaker">運動鞋</option>
              <option value="slip-on">懶人鞋</option>
              <option value="canvas">帆布鞋</option>
              <option value="boat">帆船鞋</option>
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
              <option value="white">白色</option>
              <option value="black">黑色</option>
              <option value="gray">灰色</option>
              <option value="blue">藍色</option>
              <option value="brown">棕色</option>
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
              <option value="0-3000">NT$ 3,000 以下</option>
              <option value="3000-5000">NT$ 3,000 - 5,000</option>
              <option value="5000-7000">NT$ 5,000 - 7,000</option>
              <option value="7000+">NT$ 7,000 以上</option>
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
              <span
                v-if="product.isHot"
                class="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full"
              >
                HOT
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
            <div class="space-y-1 mb-3">
              <p class="text-sm text-gray-600">{{ product.material }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feature in product.features"
                  :key="feature"
                  class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
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
import { ref, computed } from "vue";

const products = ref([
  {
    id: 1,
    name: "時尚休閒運動鞋",
    price: 3980,
    originalPrice: 4980,
    style: "sneaker",
    color: "white",
    material: "網布 + 真皮",
    features: ["透氣", "輕量", "氣墊"],
    rating: 5,
    reviews: 312,
    image: "/images/casual-1.jpg",
    isNew: true,
    isHot: true,
    discount: 20,
  },
  {
    id: 2,
    name: "經典帆布休閒鞋",
    price: 2280,
    originalPrice: null,
    style: "canvas",
    color: "white",
    material: "帆布",
    features: ["透氣", "經典款"],
    rating: 4,
    reviews: 234,
    image: "/images/casual-2.jpg",
    isNew: false,
    isHot: true,
    discount: 0,
  },
  {
    id: 3,
    name: "懶人一腳蹬休閒鞋",
    price: 3480,
    originalPrice: null,
    style: "slip-on",
    color: "black",
    material: "小牛皮",
    features: ["輕鬆穿脫", "柔軟"],
    rating: 5,
    reviews: 189,
    image: "/images/casual-3.jpg",
    isNew: true,
    isHot: false,
    discount: 0,
  },
  {
    id: 4,
    name: "經典帆船鞋",
    price: 4280,
    originalPrice: 4980,
    style: "boat",
    color: "brown",
    material: "真皮",
    features: ["防滑", "經典款"],
    rating: 4,
    reviews: 156,
    image: "/images/casual-4.jpg",
    isNew: false,
    isHot: false,
    discount: 14,
  },
  {
    id: 5,
    name: "輕量運動休閒鞋",
    price: 3680,
    originalPrice: null,
    style: "sneaker",
    color: "gray",
    material: "飛織網布",
    features: ["超輕量", "透氣", "彈力"],
    rating: 5,
    reviews: 267,
    image: "/images/casual-5.jpg",
    isNew: true,
    isHot: true,
    discount: 0,
  },
  {
    id: 6,
    name: "復古帆布鞋",
    price: 2680,
    originalPrice: 2980,
    style: "canvas",
    color: "blue",
    material: "帆布",
    features: ["復古風", "百搭"],
    rating: 4,
    reviews: 198,
    image: "/images/casual-6.jpg",
    isNew: false,
    isHot: false,
    discount: 10,
  },
  {
    id: 7,
    name: "商務懶人鞋",
    price: 4580,
    originalPrice: null,
    style: "slip-on",
    color: "black",
    material: "頭層牛皮",
    features: ["商務", "舒適"],
    rating: 5,
    reviews: 143,
    image: "/images/casual-7.jpg",
    isNew: true,
    isHot: false,
    discount: 0,
  },
  {
    id: 8,
    name: "麂皮帆船鞋",
    price: 4880,
    originalPrice: 5480,
    style: "boat",
    color: "brown",
    material: "麂皮",
    features: ["防滑", "質感"],
    rating: 4,
    reviews: 112,
    image: "/images/casual-8.jpg",
    isNew: false,
    isHot: false,
    discount: 11,
  },
  {
    id: 9,
    name: "透氣網面運動鞋",
    price: 2980,
    originalPrice: null,
    style: "sneaker",
    color: "white",
    material: "網布",
    features: ["透氣", "輕量", "運動"],
    rating: 4,
    reviews: 289,
    image: "/images/casual-9.jpg",
    isNew: true,
    isHot: true,
    discount: 0,
  },
]);

const filterStyle = ref("");
const filterColor = ref("");
const filterPrice = ref("");
const sortBy = ref("default");

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
    sneaker: "運動鞋",
    "slip-on": "懶人鞋",
    canvas: "帆布鞋",
    boat: "帆船鞋",
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