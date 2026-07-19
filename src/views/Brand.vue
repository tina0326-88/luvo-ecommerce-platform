<template>
  <div>
    <!-- Hero 形象圖 -->
    <section
      class="relative h-[500px] overflow-hidden bg-gradient-to-r from-amber-900 to-amber-700"
    >
      <!-- 背景圖片-->
      <img
        src="/images/brand-hero.jpg"
        alt="品牌專屬優惠"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/40 flex items-center">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl text-white">
            <h1 class="text-5xl font-bold mb-4 animate-fade-in">
              品牌專屬優惠
            </h1>
            <p class="text-2xl leading-relaxed animate-slide-up">
              每消費 NT$100 = 1 積分，累積可折抵現金，購物越多回饋越多！
            </p>

            <!-- 會員積分卡片 -->
            <div
              v-if="userStore.isAuthenticated"
              class="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-up"
              style="animation-delay: 0.2s"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm opacity-90">您的積分</p>
                  <p class="text-4xl font-bold">
                    {{ userStore.availablePoints }}
                  </p>
                  <p class="text-xs opacity-75 mt-1">
                    可折抵 ${{ userStore.availablePoints }} 元
                  </p>
                </div>
                <div>
                  <p class="text-sm opacity-90">會員等級</p>
                  <p class="text-2xl font-bold">
                    {{ userStore.userLevelName }}
                  </p>
                  <p class="text-xs opacity-75 mt-1">
                    {{
                      userStore.amountToNextLevel > 0
                        ? `再消費 $${userStore.amountToNextLevel.toLocaleString("zh-TW")} 升級`
                        : "已達最高等級"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 積分規則說明 -->
    <section class="bg-gradient-to-b bg-white py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">
            積分回饋機制
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              v-for="(rule, index) in pointRules"
              :key="index"
              class="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div class="text-5xl mb-4 text-center">{{ rule.icon }}</div>
              <h3 class="text-xl font-bold mb-3 text-center text-gray-800">
                {{ rule.title }}
              </h3>
              <p class="text-gray-600 text-center">
                {{ rule.description }}
              </p>
            </div>
          </div>

          <!-- 會員等級說明 -->
          <div
            class="bg-gradient-to-r from-amber-800 to-amber-900 rounded-xl p-8 text-white"
          >
            <h3 class="text-2xl font-bold mb-6 text-center">會員等級制度</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="level in memberLevels"
                :key="level.name"
                :class="[
                  'bg-white/10 rounded-lg p-4 text-center transition-all',
                  userStore.userLevel === level.value
                    ? 'ring-4 ring-yellow-400 scale-110'
                    : '',
                ]"
              >
                <div class="text-3xl mb-2">{{ level.icon }}</div>
                <div class="font-bold">{{ level.name }}</div>
                <div class="text-xs opacity-75 mt-1">
                  {{ level.requirement }}
                </div>
                <div class="text-sm mt-2 text-white/90">
                  {{ level.benefit }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 可用優惠券 -->
    <section
      v-if="userStore.isAuthenticated && availableCoupons.length > 0"
      class="container mx-auto px-4 py-12"
    >
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">
        可領取的優惠券
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          class="relative bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <!-- 優惠券樣式裝飾 -->
          <div
            class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"
          ></div>

          <div class="relative p-6 text-white">
            <!-- 優惠券金額 -->
            <div class="text-center mb-4">
              <div class="text-5xl font-bold">${{ coupon.value }}</div>
              <div class="text-sm opacity-90">優惠券</div>
            </div>

            <!-- 使用條件 -->
            <div class="text-sm text-center mb-4 opacity-90">
              <p>{{ coupon.description }}</p>
              <p class="mt-1">
                滿 ${{ coupon.minAmount.toLocaleString("zh-TW") }} 可用
              </p>
            </div>

            <!-- 有效期限 -->
            <div class="text-xs text-center opacity-75 mb-4">
              有效期至：{{ coupon.expiryDate }}
            </div>

            <!-- 領取按鈕 -->
            <button
              @click="claimCoupon(coupon)"
              :disabled="coupon.claimed"
              :class="[
                'w-full py-2 rounded-lg font-bold transition-all',
                coupon.claimed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-400 text-amber-900 hover:bg-yellow-300',
              ]"
            >
              {{ coupon.claimed ? "已領取" : "立即領取" }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 品牌專屬優惠商品 -->
    <section class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">品牌專屬優惠商品</h2>

        <!-- 積分篩選 -->
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="showOnlyPointsRedeemable"
              class="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
            />
            <span class="text-sm font-medium text-gray-700"
              >只顯示可用積分兌換</span
            >
          </label>

          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
          >
            <option value="default">預設排序</option>
            <option value="price-asc">價格：低到高</option>
            <option value="price-desc">價格：高到低</option>
            <option value="points-asc">所需積分：少到多</option>
          </select>
        </div>
      </div>

      <!-- 商品網格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
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

            <!-- 品牌專屬標籤 -->
            <div
              class="absolute top-4 left-4 bg-gradient-to-r bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            >
              品牌專屬
            </div>

            <!-- 積分兌換標籤 -->
            <div
              v-if="product.pointsRequired"
              class="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            >
              {{ product.pointsRequired }} 積分可兌換
            </div>

            <!-- Hover 操作按鈕 -->
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <div class="flex gap-2">
                <button
                  @click="toggleFavorite(product)"
                  class="bg-white text-gray-800 p-3 rounded-full hover:bg-amber-800 hover:text-white transition-colors shadow-lg"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 商品資訊 -->
          <div class="p-4">
            <h3 class="font-medium text-gray-800 mb-2 line-clamp-2">
              {{ product.name }}
            </h3>

            <!-- 評分 -->
            <div class="flex items-center gap-2 mb-2">
              <div class="flex items-center">
                <svg
                  v-for="star in 5"
                  :key="star"
                  :class="[
                    'w-4 h-4',
                    star <= product.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300',
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-500"
                >({{ product.reviewCount }})</span
              >
            </div>

            <!-- 價格和積分 -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-2xl font-bold text-red-600">
                  ${{ product.price.toLocaleString("zh-TW") }}
                </span>
                <span v-if="product.earnPoints" class="text-sm text-gray-500">
                  購買可獲 {{ product.earnPoints }} 積分
                </span>
              </div>

              <!-- 積分兌換選項 -->
              <div
                v-if="
                  product.pointsRequired &&
                  userStore.availablePoints >= product.pointsRequired
                "
                class="text-sm text-green-600 font-medium"
              >
                可使用 {{ product.pointsRequired }} 積分兌換
              </div>
            </div>

            <!-- 按鈕組 -->
            <div class="flex gap-2">
              <button
                @click="addToCart(product, false)"
                class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium"
              >
                現金購買
              </button>

              <button
                v-if="
                  product.pointsRequired &&
                  userStore.availablePoints >= product.pointsRequired
                "
                @click="addToCart(product, true)"
                class="flex-1 px-4 py-2 bg-yellow-400 text-amber-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
              >
                積分兌換
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 無商品提示 -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
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
        <p class="text-gray-500">目前沒有符合條件的商品</p>
      </div>
    </section>

    <!-- 登入提示 -->
    <section
      v-if="!userStore.isAuthenticated"
      class="bg-gradient-to-r from-amber-600 to-amber-800 py-16"
    >
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-4">
          立即登入，開始累積積分！
        </h2>
        <p class="text-xl text-amber-100 mb-8">
          登入會員即可享受積分回饋和專屬優惠
        </p>
        <router-link
          to="/login"
          class="inline-block px-12 py-4 bg-amber-800 text-white text-lg font-bold rounded-lg hover:bg-amber-900 transition-all transform hover:scale-110 shadow-2xl"
        >
          立即登入
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const userStore = useUserStore();
const cartStore = useCartStore();

// 積分規則
const pointRules = [
  {
    title: "消費賺積分",
    description: "每消費 $100 = 1 積分",
  },
  {
    title: "積分折現金",
    description: "1 積分 = $1 折抵",
  },
  {
    title: "永久有效",
    description: "積分永不過期，累積越多回饋越多",
  },
];

// 會員等級
const memberLevels = [
  {
    name: "銅級",
    value: "bronze",
    requirement: "$0+",
    benefit: "1倍積分",
  },
  {
    name: "銀級",
    value: "silver",
    requirement: "$10,000+",
    benefit: "1.2倍積分",
  },
  {
    name: "金級",
    value: "gold",
    requirement: "$30,000+",
    benefit: "1.5倍積分",
  },
  {
    name: "白金",
    value: "platinum",
    requirement: "$50,000+",
    benefit: "2倍積分",
  },
];

// 可用優惠券
const availableCoupons = ref([
  {
    id: 1,
    value: 200,
    description: "品牌專屬折扣",
    minAmount: 2000,
    expiryDate: "2025/12/31",
    claimed: false,
  },
  {
    id: 2,
    value: 500,
    description: "高級會員專享",
    minAmount: 5000,
    expiryDate: "2025/12/31",
    claimed: false,
  },
  {
    id: 3,
    value: 1000,
    description: "白金會員特典",
    minAmount: 10000,
    expiryDate: "2025/12/31",
    claimed: false,
  },
]);

// 篩選和排序
const showOnlyPointsRedeemable = ref(false);
const sortBy = ref("default");

// 商品資料
const products = ref([
  {
    id: 301,
    name: "【Luvo】極致優雅紳士德比皮鞋",
    price: 2980,
    image: "/images/product-1.jpg",
    category: "leather-shoes",
    rating: 4.7,
    reviewCount: 85,
    stock: 12,
    pointsRequired: 2980,
    earnPoints: 30,
  },
  {
    id: 302,
    name: "【Luvo】經典復古綁帶德比皮鞋",
    price: 3980,
    image: "/images/product-2.jpg",
    category: "leather-shoes",
    rating: 4.8,
    reviewCount: 96,
    stock: 15,
    pointsRequired: 3980,
    earnPoints: 40,
  },
  {
    id: 303,
    name: "【Luvo】簡約百搭時尚牛津皮鞋",
    price: 2280,
    image: "/images/product-3.jpg",
    category: "leather-shoes",
    rating: 4.6,
    reviewCount: 72,
    stock: 20,
    pointsRequired: 2280,
    earnPoints: 23,
  },
  {
    id: 304,
    name: "【Luvo】復古訂製簡約俐落長靴款",
    price: 2480,
    image: "/images/product-4.jpg",
    category: "boots",
    rating: 4.5,
    reviewCount: 68,
    stock: 10,
    pointsRequired: 2480,
    earnPoints: 25,
  },
  {
    id: 305,
    name: "【Luvo】溫暖包覆舒適透氣長靴款",
    price: 4980,
    image: "/images/product-5.jpg",
    category: "boots",
    rating: 4.9,
    reviewCount: 112,
    stock: 8,
    pointsRequired: 4980,
    earnPoints: 50,
  },
  {
    id: 306,
    name: "【Luvo】高筒設計支撐足部舒適靴",
    price: 4480,
    image: "/images/product-6.jpg",
    category: "boots",
    rating: 4.8,
    reviewCount: 98,
    stock: 14,
    pointsRequired: 4480,
    earnPoints: 45,
  },
]);

// 過濾後的商品
const filteredProducts = computed(() => {
  let result = [...products.value];

  // 積分篩選
  if (showOnlyPointsRedeemable.value) {
    result = result.filter(
      (p) => p.pointsRequired && userStore.availablePoints >= p.pointsRequired
    );
  }

  // 排序
  switch (sortBy.value) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "points-asc":
      result.sort(
        (a, b) => (a.pointsRequired || 9999999) - (b.pointsRequired || 9999999)
      );
      break;
  }

  return result;
});

// 領取優惠券
const claimCoupon = (coupon) => {
  if (coupon.claimed) return;

  coupon.claimed = true;
  cartStore.showNotification(`成功領取 $${coupon.value} 優惠券！`, "success");

  // 這裡加入實際的 API 請求
};

// 加入購物車
const addToCart = (product, usePoints) => {
  if (usePoints) {
    // 使用積分兌換
    if (userStore.availablePoints < product.pointsRequired) {
      cartStore.showNotification("積分不足", "error");
      return;
    }

    // 扣除積分
    userStore.user.points -= product.pointsRequired;

    // 加入購物車（價格為0）
    cartStore.addItem({
      ...product,
      price: 0,
      originalPrice: product.price,
      isPointsRedemption: true,
      pointsUsed: product.pointsRequired,
    });

    cartStore.showNotification(
      `使用 ${product.pointsRequired} 積分兌換成功！`,
      "success"
    );
  } else {
    // 一般購買
    cartStore.addItem(product);
  }
};

// 切換收藏
const toggleFavorite = (product) => {
  const result = userStore.toggleFavorite(product);
  cartStore.showNotification(
    result.message,
    result.success ? "success" : "warning"
  );
};
</script>

<style scoped>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
