<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-800">我的優惠券</h1>
        <p class="text-gray-600 mt-2">
          您有 {{ availableCoupons.length }} 張可使用的優惠券
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- 優惠券狀態篩選 -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <div class="flex flex-wrap gap-3">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              @click="currentStatus = tab.value"
              :class="[
                'px-6 py-3 rounded-lg font-medium transition-colors',
                currentStatus === tab.value
                  ? 'bg-amber-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ tab.label }}
              <span
                v-if="getStatusCount(tab.value) > 0"
                class="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm"
              >
                {{ getStatusCount(tab.value) }}
              </span>
            </button>
          </div>
        </div>

        <!-- 優惠券列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="coupon in filteredCoupons"
            :key="coupon.id"
            :class="[
              'relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300',
              coupon.status === 'available' ? 'hover:shadow-xl' : 'opacity-60',
            ]"
          >
            <!-- 優惠券背景裝飾 -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-30"
            ></div>

            <div class="relative p-6">
              <!-- 優惠券標籤 -->
              <div class="flex items-start justify-between mb-4">
                <div>
                  <span
                    :class="[
                      'inline-block px-3 py-1 rounded-full text-xs font-bold mb-2',
                      getCouponTypeClass(coupon.type),
                    ]"
                  >
                    {{ getCouponTypeText(coupon.type) }}
                  </span>
                  <h3 class="text-xl font-bold text-gray-800">
                    {{ coupon.name }}
                  </h3>
                </div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getStatusClass(coupon.status),
                  ]"
                >
                  {{ getStatusText(coupon.status) }}
                </span>
              </div>

              <!-- 優惠金額 -->
              <div class="mb-4">
                <div
                  v-if="coupon.type === 'discount'"
                  class="flex items-end gap-2"
                >
                  <span class="text-5xl font-bold text-amber-800">{{
                    coupon.discount
                  }}</span>
                  <span class="text-2xl font-bold text-amber-800 mb-1">折</span>
                </div>
                <div v-else class="flex items-end gap-2">
                  <span class="text-3xl font-bold text-amber-800"
                    >NT$ {{ coupon.amount }}</span
                  >
                </div>
              </div>

              <!-- 使用條件 -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ coupon.condition }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  有效期限：{{ coupon.expireDate }}
                </div>
                <div
                  v-if="coupon.scope"
                  class="flex items-center text-sm text-gray-600"
                >
                  <svg
                    class="w-4 h-4 mr-2 text-gray-400"
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
                  {{ coupon.scope }}
                </div>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex gap-2">
                <button
                  v-if="coupon.status === 'available'"
                  @click="useCoupon(coupon)"
                  class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
                >
                  立即使用
                </button>
                <button
                  @click="viewCouponDetail(coupon)"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  詳情
                </button>
              </div>
            </div>

            <!-- 優惠券圓角裝飾 -->
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full"
            ></div>
            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-l-full"
            ></div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div
          v-if="filteredCoupons.length === 0"
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
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          <p class="text-gray-500 text-lg mb-4">
            目前沒有{{ currentStatusText }}的優惠券
          </p>
          <router-link
            to="/"
            class="inline-block px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            前往領取優惠券
          </router-link>
        </div>

        <!-- 優惠券中心 -->
        <div v-if="availableCoupons.length > 0" class="mt-12">
          <div
            class="bg-gradient-to-r from-amber-800 to-amber-600 rounded-xl p-8 text-white text-center"
          >
            <h2 class="text-3xl font-bold mb-4">更多優惠券等你領取</h2>
            <p class="text-lg mb-6">立即前往優惠券中心，領取更多專屬優惠</p>
            <router-link
              to="/promotions"
              class="inline-block px-8 py-3 bg-white text-amber-800 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              前往優惠券中心
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const coupons = ref([
  {
    id: 1,
    name: "新會員專屬優惠",
    type: "cash",
    amount: 100,
    condition: "無門檻使用",
    expireDate: "2025-03-31",
    scope: "全館商品",
    status: "available",
  },
  {
    id: 2,
    name: "滿額折扣券",
    type: "cash",
    amount: 500,
    condition: "消費滿 NT$ 3,000",
    expireDate: "2025-02-28",
    scope: "全館商品",
    status: "available",
  },
  {
    id: 3,
    name: "皮鞋專區9折券",
    type: "discount",
    discount: 9,
    condition: "限皮鞋系列使用",
    expireDate: "2025-02-15",
    scope: "皮鞋系列",
    status: "available",
  },
  {
    id: 4,
    name: "生日專屬優惠",
    type: "cash",
    amount: 200,
    condition: "消費滿 NT$ 1,000",
    expireDate: "2025-01-31",
    scope: "全館商品",
    status: "available",
  },
  {
    id: 5,
    name: "週年慶滿額折扣",
    type: "cash",
    amount: 1000,
    condition: "消費滿 NT$ 10,000",
    expireDate: "2025-12-31",
    scope: "全館商品",
    status: "available",
  },
  {
    id: 6,
    name: "免運券",
    type: "shipping",
    amount: 100,
    condition: "無門檻使用",
    expireDate: "2025-01-31",
    scope: "運費折抵",
    status: "available",
  },
  {
    id: 7,
    name: "已使用優惠券",
    type: "cash",
    amount: 300,
    condition: "消費滿 NT$ 2,000",
    expireDate: "2025-01-10",
    scope: "全館商品",
    status: "used",
  },
  {
    id: 8,
    name: "已過期優惠券",
    type: "discount",
    discount: 85,
    condition: "限靴子系列使用",
    expireDate: "2024-12-31",
    scope: "靴子系列",
    status: "expired",
  },
]);

const statusTabs = [
  { label: "可使用", value: "available" },
  { label: "已使用", value: "used" },
  { label: "已過期", value: "expired" },
];

const currentStatus = ref("available");

const filteredCoupons = computed(() => {
  return coupons.value.filter(
    (coupon) => coupon.status === currentStatus.value,
  );
});

const availableCoupons = computed(() => {
  return coupons.value.filter((coupon) => coupon.status === "available");
});

const currentStatusText = computed(() => {
  const tab = statusTabs.find((t) => t.value === currentStatus.value);
  return tab ? tab.label : "";
});

const getStatusCount = (status) => {
  return coupons.value.filter((coupon) => coupon.status === status).length;
};

const getCouponTypeClass = (type) => {
  const classes = {
    cash: "bg-red-100 text-red-800",
    discount: "bg-blue-100 text-blue-800",
    shipping: "bg-green-100 text-green-800",
  };
  return classes[type] || "bg-gray-100 text-gray-800";
};

const getCouponTypeText = (type) => {
  const texts = {
    cash: "現金券",
    discount: "折扣券",
    shipping: "免運券",
  };
  return texts[type] || type;
};

const getStatusClass = (status) => {
  const classes = {
    available: "bg-green-100 text-green-800",
    used: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusText = (status) => {
  const texts = {
    available: "可使用",
    used: "已使用",
    expired: "已過期",
  };
  return texts[status] || status;
};

const useCoupon = (coupon) => {
  alert(`使用優惠券：${coupon.name}\n系統將自動跳轉到購物頁面`);
};

const viewCouponDetail = (coupon) => {
  alert(
    `優惠券詳情：\n\n名稱：${coupon.name}\n類型：${getCouponTypeText(coupon.type)}\n使用條件：${coupon.condition}\n有效期限：${coupon.expireDate}\n適用範圍：${coupon.scope}`,
  );
};
</script>
