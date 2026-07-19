<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面橫幅 -->
    <div class="relative h-96 overflow-hidden">
      <img
        src="/images/bag-1.jpg"
        alt="托特包系列"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <h1 class="text-6xl font-bold mb-4">托特包系列</h1>
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
              <option value="navy">深藍</option>
              <option value="gray">灰色</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >尺寸</label
            >
            <select
              v-model="filterSize"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部尺寸</option>
              <option value="small">小型</option>
              <option value="medium">中型</option>
              <option value="large">大型</option>
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-gray-200">
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
            <span
              v-if="product.isHot"
              class="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full"
            >
              HOT
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

          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {{ product.material }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                {{ product.dimensions }}
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="feature in product.features"
                :key="feature"
                class="px-2 py-1 bg-amber-50 text-amber-800 text-xs rounded-full"
              >
                {{ feature }}
              </span>
            </div>

            <div
              class="flex items-end justify-between pt-4 border-t border-gray-200"
            >
              <div>
                <p class="text-3xl font-bold text-amber-800">
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
                class="px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium"
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
    name: "經典商務托特包",
    price: 4980,
    originalPrice: 5980,
    color: "black",
    size: "large",
    material: "頭層牛皮",
    dimensions: "40cm x 30cm x 12cm",
    description: "大容量設計，適合日常通勤使用",
    features: ["多功能夾層", "YKK拉鍊", "可調式背帶"],
    image: "/images/bag-1.jpg",
    isNew: false,
    isHot: true,
  },
  {
    id: 2,
    name: "輕便帆布托特包",
    price: 2380,
    originalPrice: null,
    color: "navy",
    size: "medium",
    material: "帆布 + 皮革提把",
    dimensions: "35cm x 28cm x 10cm",
    description: "輕量耐用，休閒時尚",
    features: ["內袋設計", "耐磨帆布", "真皮提把"],
    image: "/images/bag-2.jpg",
    isNew: true,
    isHot: false,
  },
  {
    id: 3,
    name: "復古公事托特包",
    price: 5680,
    originalPrice: 6280,
    color: "brown",
    size: "large",
    material: "瘋馬皮",
    dimensions: "42cm x 32cm x 14cm",
    description: "復古質感，展現成熟魅力",
    features: ["筆電夾層", "防刮材質", "金屬五金"],
    image: "/images/bag-3.jpg",
    isNew: true,
    isHot: true,
  },
  {
    id: 4,
    name: "簡約通勤包",
    price: 3280,
    originalPrice: null,
    color: "gray",
    size: "medium",
    material: "尼龍 + 真皮",
    dimensions: "38cm x 28cm x 8cm",
    description: "輕盈防水，都會首選",
    features: ["防潑水", "輕量設計", "隱藏口袋"],
    image: "/images/bag-4.jpg",
    isNew: false,
    isHot: false,
  },
  {
    id: 5,
    name: "時尚女仕托特包",
    price: 4280,
    originalPrice: 4980,
    color: "black",
    size: "small",
    material: "小牛皮",
    dimensions: "30cm x 25cm x 10cm",
    description: "精緻小巧，優雅大方",
    features: ["磁扣設計", "內袋分隔", "可拆背帶"],
    image: "/images/bag-5.jpg",
    isNew: true,
    isHot: false,
  },
  {
    id: 6,
    name: "多功能旅行托特包",
    price: 3980,
    originalPrice: null,
    color: "navy",
    size: "large",
    material: "防水尼龍",
    dimensions: "45cm x 35cm x 15cm",
    description: "超大容量，旅行必備",
    features: ["防水材質", "行李箱固定帶", "多層收納"],
    image: "/images/bag-6.jpg",
    isNew: false,
    isHot: true,
  },
]);

const filterColor = ref("");
const filterSize = ref("");
const sortBy = ref("default");
const favorites = ref([]);

const filteredProducts = computed(() => {
  let result = products.value;

  if (filterColor.value) {
    result = result.filter((p) => p.color === filterColor.value);
  }

  if (filterSize.value) {
    result = result.filter((p) => p.size === filterSize.value);
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
