<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">收藏清單</h1>
            <p class="text-gray-600 mt-2">
              您收藏了 {{ favorites.length }} 件商品
            </p>
          </div>
          <button
            v-if="favorites.length > 0"
            @click="clearAll"
            class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            清空收藏
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- 收藏商品列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in favorites"
            :key="item.id"
            class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
          >
            <div class="relative aspect-square overflow-hidden bg-gray-200">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span
                  v-if="item.isNew"
                  class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
                >
                  NEW
                </span>
                <span
                  v-if="item.discount"
                  class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
                >
                  -{{ item.discount }}%
                </span>
                <span
                  v-if="item.stock === 0"
                  class="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full"
                >
                  已售完
                </span>
              </div>
              <button
                @click="removeFavorite(item.id)"
                class="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-red-50 transition-colors group"
              >
                <svg
                  class="w-5 h-5 text-red-500 fill-current"
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
              <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-500 mb-3">{{ item.category }}</p>

              <div class="flex items-center gap-2 mb-3">
                <div class="flex gap-1">
                  <span v-for="i in 5" :key="i" class="text-yellow-400">
                    <svg
                      class="w-4 h-4"
                      :class="i <= item.rating ? 'fill-current' : ''"
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
                <span class="text-xs text-gray-500">({{ item.reviews }})</span>
              </div>

              <div class="mb-4">
                <p class="text-2xl font-bold text-amber-800">
                  NT$ {{ formatPrice(item.price) }}
                </p>
                <p
                  v-if="item.originalPrice"
                  class="text-sm text-gray-400 line-through"
                >
                  NT$ {{ formatPrice(item.originalPrice) }}
                </p>
              </div>

              <div class="flex gap-2">
                <button
                  @click="addToCart(item)"
                  :disabled="item.stock === 0"
                  class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {{ item.stock === 0 ? "已售完" : "加入購物車" }}
                </button>
                <button
                  @click="viewProduct(item)"
                  class="px-4 py-2 border border-amber-800 text-amber-800 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div
          v-if="favorites.length === 0"
          class="bg-white rounded-xl shadow-md p-16 text-center"
        >
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
          <p class="text-gray-500 text-lg mb-4">您還沒有收藏任何商品</p>
          <p class="text-gray-400 text-sm mb-6">
            瀏覽商品時點擊愛心圖示即可收藏
          </p>
          <router-link
            to="/products/leather-shoes"
            class="inline-block px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            前往選購
          </router-link>
        </div>

        <!-- 推薦商品 -->
        <div v-if="favorites.length > 0" class="mt-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">您可能也喜歡</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              v-for="item in recommendations"
              :key="item.id"
              class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              <div class="relative aspect-square overflow-hidden bg-gray-200">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  @click="addToFavorites(item)"
                  class="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
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
                <h3 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  {{ item.name }}
                </h3>
                <p class="text-lg font-bold text-amber-800">
                  NT$ {{ formatPrice(item.price) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const favorites = ref([
  {
    id: 1,
    name: "紳士格調經典牛津皮鞋",
    price: 6980,
    originalPrice: 7980,
    category: "皮鞋",
    rating: 5,
    reviews: 156,
    stock: 45,
    image: "/images/product-1.jpg",
    isNew: false,
    discount: 13,
  },
  {
    id: 2,
    name: "復古風範雕花牛津皮鞋",
    price: 7980,
    originalPrice: 8980,
    category: "皮鞋",
    rating: 5,
    reviews: 98,
    stock: 8,
    image: "/images/product-3.jpg",
    isNew: true,
    discount: 11,
  },
  {
    id: 3,
    name: "經典切爾西靴",
    price: 8980,
    originalPrice: null,
    category: "靴子",
    rating: 5,
    reviews: 145,
    stock: 18,
    image: "/images/product-7.jpg",
    isNew: true,
    discount: 0,
  },
  {
    id: 4,
    name: "時尚休閒運動鞋",
    price: 3980,
    originalPrice: 4980,
    category: "休閒鞋",
    rating: 5,
    reviews: 312,
    stock: 0,
    image: "/images/product-6.jpg",
    isNew: false,
    discount: 20,
  },
  {
    id: 5,
    name: "經典真皮皮帶",
    price: 1980,
    originalPrice: 2480,
    category: "配件",
    rating: 4,
    reviews: 89,
    stock: 45,
    image: "/images/belt-1.jpg",
    isNew: false,
    discount: 20,
  },
  {
    id: 6,
    name: "商務紳士襪 3雙組",
    price: 680,
    originalPrice: null,
    category: "配件",
    rating: 5,
    reviews: 234,
    stock: 120,
    image: "/images/socks-1.jpg",
    isNew: true,
    discount: 0,
  },
]);

const recommendations = ref([
  {
    id: 101,
    name: "都會型男樂福鞋",
    price: 5400,
    image: "/images/product-5.jpg",
  },
  {
    id: 102,
    name: "工裝馬丁靴",
    price: 7680,
    image: "/images/product-8.jpg",
  },
  {
    id: 103,
    name: "商務自動扣皮帶",
    price: 2380,
    image: "/images/belt-2.jpg",
  },
  {
    id: 104,
    name: "經典商務托特包",
    price: 4980,
    image: "/images/bag-1.jpg",
  },
]);

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const removeFavorite = (id) => {
  if (confirm("確定要從收藏清單中移除此商品嗎？")) {
    const index = favorites.value.findIndex((item) => item.id === id);
    if (index > -1) {
      favorites.value.splice(index, 1);
    }
  }
};

const clearAll = () => {
  if (confirm("確定要清空所有收藏嗎？")) {
    favorites.value = [];
    alert("已清空收藏清單");
  }
};

const addToCart = (item) => {
  alert(`已將「${item.name}」加入購物車`);
};

const viewProduct = (item) => {
  alert(`查看商品：${item.name}`);
};

const addToFavorites = (item) => {
  favorites.value.push({
    ...item,
    category: "推薦商品",
    rating: 5,
    reviews: 100,
    stock: 50,
    isNew: false,
    discount: 0,
    originalPrice: null,
  });
  alert(`已將「${item.name}」加入收藏`);
};
</script>
