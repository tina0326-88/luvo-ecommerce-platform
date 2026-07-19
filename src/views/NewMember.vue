<template>
  <div>
    <!-- Hero 形象圖 -->
    <section class="relative h-[500px] overflow-hidden">
      <!-- 背景圖片 -->
      <img
        src="/images/register-hero.jpg"
        alt="新會員首購禮"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- 遮罩層 -->
      <div class="absolute inset-0 bg-black/50 flex items-center">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl text-white">
            <h1 class="text-5xl font-bold mb-4 animate-fade-in">
              新會員首購禮
            </h1>
            <p class="text-2xl leading-relaxed animate-slide-up">
              註冊即享 NT$100 折扣券（滿 NT$1,000 可用）
            </p>

            <!-- 註冊按鈕 -->
            <router-link
              to="/register"
              class="inline-block mt-8 px-8 py-4 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-all transform hover:scale-105 shadow-xl"
            >
              立即加入會員
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 優惠說明 -->
    <section class="bg-gradient-to-b py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">
            新會員專屬福利
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 福利卡片 -->
            <div
              v-for="(benefit, index) in benefits"
              :key="index"
              class="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <h3 class="text-xl font-bold mb-3 text-center text-gray-800">
                {{ benefit.title }}
              </h3>
              <p class="text-gray-600 text-center">
                {{ benefit.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新會員專屬商品 -->
    <section class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">新會員專屬商品</h2>

        <!-- 篩選器 -->
        <div class="flex gap-2">
          <button
            v-for="category in categories"
            :key="category.value"
            @click="selectedCategory = category.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              selectedCategory === category.value
                ? 'bg-amber-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- 商品網格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 使用 ProductCard 組件 -->
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        >
          <!-- 新會員專屬標籤 -->
          <template #badge>
            <span
              class="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse"
            >
              新會員專屬
            </span>
          </template>
        </ProductCard>
      </div>

      <!-- 載入更多按鈕 -->
      <div v-if="hasMore" class="text-center mt-12">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-8 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">載入更多商品</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
            載入中...
          </span>
        </button>
      </div>
    </section>

    <!-- 註冊引導 CTA -->
    <section class="relative w-full h-96 md:h-[500px] overflow-hidden">
      <!-- 滿版橫幅圖片 -->
      <img
        src="/images/register-hero.jpg"
        alt="註冊優惠"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- 半透明遮罩層 -->
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>

      <!-- 文字和按鈕內容 -->
      <div
        class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center"
      >
        <h2
          class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
        >
          還不是會員嗎？
        </h2>
        <p class="text-xl md:text-2xl text-white mb-8 drop-shadow-lg">
          立即註冊，享受新會員專屬優惠！
        </p>
        <router-link
          to="/register"
          class="inline-block px-12 py-4 bg-amber-800 text-white text-lg font-bold rounded-lg hover:bg-amber-900 transition-all transform hover:scale-110 shadow-2xl"
        >
          馬上註冊
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ProductCard from "../components/business/ProductCard.vue";

// 數據層

// 福利說明（靜態數據）
const benefits = [
  {
    title: "$100 折扣券",
    description: "註冊完成即贈，滿 $1,000 可使用",
  },
  {
    title: "生日禮遇",
    description: "當月壽星享專屬生日折扣",
  },
  {
    title: "新品搶先看",
    description: "新品上市優先通知，不錯過好物",
  },
];

// 分類選項
const categories = [
  { label: "全部", value: "all" },
  { label: "皮鞋", value: "leather-shoes" },
  { label: "靴子", value: "boots" },
];

// 當前選擇的分類
const selectedCategory = ref("all");

// 載入狀態
const loading = ref(false);

// 是否還有更多商品
const hasMore = ref(true);

// 商品列表（動態數據）
const products = ref([
  {
    id: 101,
    name: "【Luvo】紳士格調經典牛津皮鞋",
    price: 6980,
    image: "/images/product-1.jpg",
    category: "leather-shoes",
    rating: 4.8,
    reviewCount: 128,
    isNew: true,
    stock: 10,
    sizes: ["39", "40", "41", "42", "43"],
  },
  {
    id: 102,
    name: "【Luvo】摩登時尚簡約牛津皮鞋",
    price: 4980,
    image: "/images/product-2.jpg",
    discount: 15,
    category: "leather-shoes",
    rating: 4.5,
    reviewCount: 89,
    stock: 15,
    sizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: 103,
    name: "【Luvo】復古風範雕花牛津皮鞋",
    price: 7980,
    image: "/images/product-3.jpg",
    category: "leather-shoes",
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    stock: 8,
    sizes: ["39", "40", "41", "42"],
  },
  {
    id: 104,
    name: "【Luvo】登山防水耐磨戶外專業靴",
    price: 3480,
    image: "/images/product-4.jpg",
    category: "boots",
    rating: 4.7,
    reviewCount: 92,
    stock: 20,
    sizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: 105,
    name: "【Luvo】經典時尚百搭高質感短靴",
    price: 3980,
    image: "/images/product-5.jpg",
    category: "boots",
    rating: 4.6,
    reviewCount: 74,
    stock: 12,
    sizes: ["39", "40", "41", "42"],
  },
  {
    id: 106,
    name: "【Luvo】高筒時尚修飾腿型長靴款",
    price: 5980,
    image: "/images/product-6.jpg",
    category: "boots",
    rating: 4.8,
    reviewCount: 108,
    isNew: true,
    stock: 15,
    sizes: ["39", "40", "41", "42", "43"],
  },
]);

// 計算屬性（邏輯層）

// 過濾後的商品（根據選擇的分類）
const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") {
    return products.value;
  }
  return products.value.filter((p) => p.category === selectedCategory.value);
});

// 方法（事件處理）

// 載入更多商品
const loadMore = () => {
  loading.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    loading.value = false;
    hasMore.value = false; // 沒有更多商品了
  }, 1000);
};
</script>

<style scoped>
/* 動畫定義 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out 0.3s backwards;
}
</style>
