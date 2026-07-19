<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面橫幅 -->
    <div class="relative h-96 overflow-hidden">
      <img
        src="/images/belt-1.jpg"
        alt="皮帶系列"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <h1 class="text-6xl font-bold mb-4">皮帶系列</h1>
          <p class="text-2xl">工藝與品味的極致展現，每一步都是自信</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- 篩選和排序 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
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
              <option value="coffee">咖啡色</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >寬度</label
            >
            <select
              v-model="filterWidth"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部寬度</option>
              <option value="30">30mm</option>
              <option value="35">35mm</option>
              <option value="40">40mm</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
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
            </select>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative aspect-square overflow-hidden bg-gray-200">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <span
              v-if="product.isNew"
              class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              NEW
            </span>
            <button
              @click="toggleFavorite(product.id)"
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
            <h3 class="text-lg font-medium text-gray-800 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>
            <div class="space-y-1 mb-3">
              <p class="text-sm text-gray-500">{{ product.material }}</p>
              <p class="text-sm text-gray-500">寬度：{{ product.width }}mm</p>
              <p class="text-sm text-gray-500">長度：{{ product.length }}cm</p>
            </div>
            <div class="flex items-center justify-between">
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
              <button
                @click="addToCart(product)"
                class="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors text-sm"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const products = ref([
  {
    id: 1,
    name: "經典真皮皮帶",
    price: 1980,
    originalPrice: 2480,
    color: "black",
    width: 35,
    length: 110,
    material: "義大利進口頭層牛皮",
    image: "/images/belt-1.jpg",
    isNew: false,
  },
  {
    id: 2,
    name: "商務自動扣皮帶",
    price: 2380,
    originalPrice: null,
    color: "brown",
    width: 35,
    length: 120,
    material: "頭層牛皮",
    image: "/images/belt-2.jpg",
    isNew: true,
  },
  {
    id: 3,
    name: "雙面雙色皮帶",
    price: 2680,
    originalPrice: 2980,
    color: "black",
    width: 30,
    length: 115,
    material: "義大利進口牛皮",
    image: "/images/belt-3.jpg",
    isNew: true,
  },
  {
    id: 4,
    name: "復古雕花皮帶",
    price: 2180,
    originalPrice: null,
    color: "coffee",
    width: 40,
    length: 110,
    material: "頭層牛皮",
    image: "/images/belt-4.jpg",
    isNew: false,
  },
  {
    id: 5,
    name: "簡約針扣皮帶",
    price: 1680,
    originalPrice: null,
    color: "brown",
    width: 35,
    length: 120,
    material: "頭層牛皮",
    image: "/images/belt-5.jpg",
    isNew: false,
  },
  {
    id: 6,
    name: "時尚編織皮帶",
    price: 1880,
    originalPrice: 2180,
    color: "coffee",
    width: 35,
    length: 115,
    material: "編織牛皮",
    image: "/images/belt-6.jpg",
    isNew: true,
  },
]);

const filterColor = ref("");
const filterWidth = ref("");
const sortBy = ref("default");
const favorites = ref([]);

const filteredProducts = computed(() => {
  let result = products.value;

  if (filterColor.value) {
    result = result.filter((p) => p.color === filterColor.value);
  }

  if (filterWidth.value) {
    result = result.filter((p) => p.width === parseInt(filterWidth.value));
  }

  if (sortBy.value === "price-low") {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-high") {
    result = [...result].sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "newest") {
    result = [...result].sort((a, b) => b.isNew - a.isNew);
  }

  return result;
});

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
};

const addToCart = (product) => {
  alert(`已將「${product.name}」加入購物車`);
};
</script>
