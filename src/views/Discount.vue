<template>
  <div>
    <!-- 買2送1形象圖 -->
    <section
      class="relative h-[500px] overflow-hidden bg-gradient-to-r from-amber-900 to-amber-700"
    >
      <!-- 背景圖片-->
      <img 
        src="/images/discount-hero.jpg" 
        alt="買2送1" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/30 flex items-center">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl text-white">
            <h1 class="text-5xl font-bold mb-4 animate-fade-in">買2送1</h1>
            <div class="text-xl leading-relaxed space-y-2 animate-slide-up">
              <p class="flex items-center gap-2">
                <svg
                  class="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                買 2 雙皮鞋，免費送 1 雙
              </p>
              <p class="flex items-center gap-2">
                <svg
                  class="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                自由搭配，經典款 & 新品皆可選
              </p>
              <p class="flex items-center gap-2">
                <svg
                  class="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                全館滿 NT$3,000 再享免運優惠
              </p>
            </div>

            <!-- 優惠倒數計時器 -->
            <div
              class="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block"
            >
              <p class="text-sm mb-2">優惠倒數</p>
              <div class="flex gap-4 text-center">
                <div>
                  <div class="text-3xl font-bold">{{ timeLeft.days }}</div>
                  <div class="text-xs">天</div>
                </div>
                <div class="text-3xl">:</div>
                <div>
                  <div class="text-3xl font-bold">{{ timeLeft.hours }}</div>
                  <div class="text-xs">時</div>
                </div>
                <div class="text-3xl">:</div>
                <div>
                  <div class="text-3xl font-bold">{{ timeLeft.minutes }}</div>
                  <div class="text-xs">分</div>
                </div>
                <div class="text-3xl">:</div>
                <div>
                  <div class="text-3xl font-bold">{{ timeLeft.seconds }}</div>
                  <div class="text-xs">秒</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 活動說明 -->
    <section class="bg-white py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
             活動辦法
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              class="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow"
            >
              <!-- <div class="text-4xl mb-3">1️</div> -->
              <h3 class="font-bold mb-2">選購 2 雙鞋款</h3>
              <p class="text-sm text-gray-600">從下方活動商品中挑選任意 2 雙</p>
            </div>
            <div
              class="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow"
            >
              <!-- <div class="text-4xl mb-3">2️</div> -->
              <h3 class="font-bold mb-2">自動贈送第 3 雙</h3>
              <p class="text-sm text-gray-600">系統將自動贈送價格最低的 1 雙</p>
            </div>
            <div
              class="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow"
            >
              <!-- <div class="text-4xl mb-3">3️</div> -->
              <h3 class="font-bold mb-2">滿額再享免運</h3>
              <p class="text-sm text-gray-600">消費滿 $3,000 即享免運優惠</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 已選商品提示 -->
    <div
      v-if="selectedProducts.length > 0"
      class="sticky top-20 z-30 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="font-bold"
              >已選 {{ selectedProducts.length }} / 2 件</span
            >
            <div class="flex gap-2">
              <div
                v-for="product in selectedProducts"
                :key="product.id"
                class="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                <span>{{ product.name.substring(0, 15) }}...</span>
                <button
                  @click="removeFromSelection(product.id)"
                  class="hover:text-yellow-400"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <button
            v-if="selectedProducts.length === 2"
            @click="addToCartPromotion"
            class="bg-yellow-400 text-red-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors animate-pulse"
          >
            立即加入購物車 
          </button>
        </div>
      </div>
    </div>

    <!-- 買2送1商品 -->
    <section class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">買2送1商品</h2>

        <!-- 篩選排序 -->
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="default">預設排序</option>
          <option value="price-asc">價格：低到高</option>
          <option value="price-desc">價格：高到低</option>
        </select>
      </div>

      <!-- 商品網格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in sortedProducts"
          :key="product.id"
          :class="[
            'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer',
            isSelected(product.id)
              ? 'ring-4 ring-red-500 transform scale-105'
              : '',
          ]"
          @click="toggleSelection(product)"
        >
           <!-- 商品圖 -->
           <div
            class="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center"
          >
          <img 
          :src="product.image" 
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

            <!-- 已選標記 -->
            <div
              v-if="isSelected(product.id)"
              class="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 animate-bounce"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- 選擇順序 -->
            <div
              v-if="getSelectionOrder(product.id)"
              class="absolute top-4 left-4 bg-yellow-400 text-red-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg"
            >
              {{ getSelectionOrder(product.id) }}
            </div>

            <!-- 買2送1標籤 -->
            <div
              class="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              買2送1
            </div>
          </div>

          <!-- 商品資訊 -->
          <div class="p-4">
            <h3 class="font-medium text-gray-800 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-red-600">
                ${{ product.price.toLocaleString("zh-TW") }}
              </span>

              <!-- 選擇按鈕 -->
              <button
                @click.stop="toggleSelection(product)"
                :disabled="
                  !isSelected(product.id) && selectedProducts.length >= 2
                "
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  isSelected(product.id)
                    ? 'bg-red-600 text-white'
                    : selectedProducts.length >= 2
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white',
                ]"
              >
                {{
                  isSelected(product.id)
                    ? "已選"
                    : selectedProducts.length >= 2
                      ? "已滿"
                      : "選擇"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="products.length === 0" class="text-center py-12">
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="text-gray-500">暫無活動商品</p>
      </div>
    </section>

    <!-- 購物提示浮動按鈕 -->
    <transition name="fade">
      <button
        v-if="selectedProducts.length > 0 && selectedProducts.length < 2"
        class="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-red-700 transition-all z-40 animate-bounce"
      >
        <div class="flex items-center gap-2">
          <span class="font-bold"
            >還差 {{ 2 - selectedProducts.length }} 件就能享優惠！</span
          >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useCartStore } from "../stores/useCartStore";

const cartStore = useCartStore();

// 已選商品
const selectedProducts = ref([]);

// 排序方式
const sortBy = ref("default");

// 倒數計時
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

let countdownTimer = null;

// 商品資料
const products = ref([
  {
    id: 101,
    name: "【Luvo】紳士優雅手工牛津皮鞋",
    price: 2480,
    image: '/images/product-1.jpg',
    category: "leather-shoes",
    stock: 20,
  },
  {
    id: 102,
    name: "【Luvo】皇家典藏手工縫製牛津鞋",
    price: 3980,
    image: '/images/product-2.jpg',
    category: "leather-shoes",
    stock: 15,
  },
  {
    id: 103,
    name: "【Luvo】皮質細膩輕奢牛津皮鞋",
    price: 4280,
    image: '/images/product-3.jpg',
    category: "leather-shoes",
    stock: 18,
  },
  {
    id: 104,
    name: "【Luvo】質感設計輕量舒適短靴款",
    price: 2980,
    image: '/images/product-4.jpg',
    category: "boots",
    stock: 12,
  },
  {
    id: 105,
    name: "【Luvo】奢華質感義式工藝長靴款",
    price: 3500,
    image: '/images/product-5.jpg',
    category: "boots",
    stock: 10,
  },
  {
    id: 106,
    name: "【Luvo】溫潤皮革手感細膩短靴款",
    price: 3480,
    image: '/images/product-6.jpg',
    category: "boots",
    stock: 14,
  },
]);

// 排序後的商品
const sortedProducts = computed(() => {
  let result = [...products.value];

  switch (sortBy.value) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
  }

  return result;
});

// 檢查是否已選
const isSelected = (productId) => {
  return selectedProducts.value.some((p) => p.id === productId);
};

// 取得選擇順序
const getSelectionOrder = (productId) => {
  const index = selectedProducts.value.findIndex((p) => p.id === productId);
  return index >= 0 ? index + 1 : null;
};

// 切換選擇
const toggleSelection = (product) => {
  if (isSelected(product.id)) {
    // 取消選擇
    selectedProducts.value = selectedProducts.value.filter(
      (p) => p.id !== product.id
    );
  } else {
    // 選擇（最多2件）
    if (selectedProducts.value.length < 2) {
      selectedProducts.value.push(product);
    } else {
      cartStore.showNotification("最多只能選擇 2 件商品", "warning");
    }
  }
};

// 從選擇中移除
const removeFromSelection = (productId) => {
  selectedProducts.value = selectedProducts.value.filter(
    (p) => p.id !== productId
  );
};

// 加入購物車（買2送1優惠）
const addToCartPromotion = () => {
  if (selectedProducts.value.length !== 2) {
    cartStore.showNotification("請選擇 2 件商品", "warning");
    return;
  }

  // 找出價格最低的商品（將作為贈品）
  const sortedByPrice = [...selectedProducts.value].sort(
    (a, b) => a.price - b.price
  );
  const freeProduct = sortedByPrice[0];
  const paidProducts = sortedByPrice.slice(1);

  // 加入付費商品
  paidProducts.forEach((product) => {
    cartStore.addItem(product);
  });

  // 加入贈品（價格設為0）
  cartStore.addItem({
    ...freeProduct,
    price: 0,
    originalPrice: freeProduct.price,
    isFreeGift: true,
    name: `${freeProduct.name} (贈品)`,
  });

  // 顯示成功訊息
  cartStore.showNotification(
    `已加入購物車！贈送：${freeProduct.name}`,
    "success"
  );

  // 清空選擇
  selectedProducts.value = [];
};

// 倒數計時邏輯
const startCountdown = () => {
  // 設定活動結束時間（例如：30天後）
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  endDate.setHours(23, 59, 59, 999);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = endDate.getTime() - now;

    if (distance < 0) {
      timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      clearInterval(countdownTimer);
      return;
    }

    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
};

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
