<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-800">管理後台儀表板</h1>
        <p class="text-gray-600 mt-2">歡迎回來,管理員</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 統計卡片區 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 總銷售額 -->
        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">總銷售額</p>
              <p class="text-3xl font-bold text-gray-800">
                NT$ {{ formatNumber(stats.totalRevenue) }}
              </p>
              <p class="text-green-600 text-sm mt-2 flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {{ stats.revenueGrowth }}% 較上月
              </p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 訂單總數 -->
        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">訂單總數</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ stats.totalOrders }}
              </p>
              <p class="text-blue-600 text-sm mt-2 flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {{ stats.ordersGrowth }}% 較上月
              </p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 商品總數 -->
        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">商品總數</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ stats.totalProducts }}
              </p>
              <p class="text-purple-600 text-sm mt-2">
                {{ stats.activeProducts }} 件上架中
              </p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 會員總數 -->
        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">會員總數</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ stats.totalUsers }}
              </p>
              <p class="text-orange-600 text-sm mt-2 flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {{ stats.usersGrowth }}% 較上月
              </p>
            </div>
            <div class="bg-orange-100 p-3 rounded-full">
              <svg
                class="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 圖表和數據區 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 銷售趨勢圖 -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">本月銷售趨勢</h2>
          <div class="h-80">
            <canvas ref="salesChart"></canvas>
          </div>
        </div>

        <!-- 熱銷商品 -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">熱銷商品 TOP 5</h2>
          <div class="space-y-4">
            <div
              v-for="(product, index) in topProducts"
              :key="product.id"
              class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-800 rounded-full font-bold"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">
                  {{ product.name }}
                </p>
                <p class="text-xs text-gray-500">已售 {{ product.sold }} 件</p>
              </div>
              <div class="text-sm font-bold text-gray-800">
                NT$ {{ formatNumber(product.revenue) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近訂單 -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">最近訂單</h2>
          <router-link
            to="/admin/orders"
            class="text-amber-800 hover:text-amber-900 text-sm font-medium"
          >
            查看全部 →
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th
                  class="text-left py-3 px-4 text-gray-600 font-medium text-sm"
                >
                  訂單編號
                </th>
                <th
                  class="text-left py-3 px-4 text-gray-600 font-medium text-sm"
                >
                  客戶
                </th>
                <th
                  class="text-left py-3 px-4 text-gray-600 font-medium text-sm"
                >
                  金額
                </th>
                <th
                  class="text-left py-3 px-4 text-gray-600 font-medium text-sm"
                >
                  狀態
                </th>
                <th
                  class="text-left py-3 px-4 text-gray-600 font-medium text-sm"
                >
                  時間
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-4 text-sm font-medium text-gray-800">
                  {{ order.orderNo }}
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ order.customer }}
                </td>
                <td class="py-3 px-4 text-sm font-medium text-gray-800">
                  NT$ {{ formatNumber(order.amount) }}
                </td>
                <td class="py-3 px-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getStatusClass(order.status),
                    ]"
                  >
                    {{ order.statusText }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ order.time }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 統計數據
const stats = ref({
  totalRevenue: 1850000,
  revenueGrowth: 15.3,
  totalOrders: 342,
  ordersGrowth: 8.5,
  totalProducts: 156,
  activeProducts: 142,
  totalUsers: 1284,
  usersGrowth: 12.7,
});

// 熱銷商品
const topProducts = ref([
  { id: 1, name: "紳士格調經典牛津皮鞋", sold: 156, revenue: 1088880 },
  { id: 2, name: "摩登時尚簡約牛津皮鞋", sold: 134, revenue: 667320 },
  { id: 3, name: "復古風範雕花牛津皮鞋", sold: 98, revenue: 782040 },
  { id: 4, name: "商務精英德比皮鞋", sold: 87, revenue: 521300 },
  { id: 5, name: "都會型男樂福鞋", sold: 76, revenue: 410280 },
]);

// 最近訂單
const recentOrders = ref([
  {
    id: 1,
    orderNo: "ORD20250107001",
    customer: "王小明",
    amount: 6980,
    status: "pending",
    statusText: "待處理",
    time: "2025-01-07 14:30",
  },
  {
    id: 2,
    orderNo: "ORD20250107002",
    customer: "李美麗",
    amount: 12960,
    status: "processing",
    statusText: "處理中",
    time: "2025-01-07 13:15",
  },
  {
    id: 3,
    orderNo: "ORD20250107003",
    customer: "張大華",
    amount: 4980,
    status: "shipped",
    statusText: "已出貨",
    time: "2025-01-07 11:20",
  },
  {
    id: 4,
    orderNo: "ORD20250106004",
    customer: "陳小芬",
    amount: 7980,
    status: "completed",
    statusText: "已完成",
    time: "2025-01-06 16:45",
  },
  {
    id: 5,
    orderNo: "ORD20250106005",
    customer: "林志明",
    amount: 15950,
    status: "completed",
    statusText: "已完成",
    time: "2025-01-06 10:30",
  },
]);

const salesChart = ref(null);

// 格式化數字
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 獲取狀態樣式
const getStatusClass = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

// 初始化圖表
const initChart = () => {
  if (!salesChart.value) return;

  const ctx = salesChart.value.getContext("2d");

  // 簡單的折線圖繪製
  const data = {
    labels: ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/7"],
    values: [45000, 52000, 48000, 61000, 58000, 63000, 72000],
  };

  // 清空畫布
  ctx.clearRect(0, 0, salesChart.value.width, salesChart.value.height);

  // 設置畫布尺寸
  salesChart.value.width = salesChart.value.offsetWidth;
  salesChart.value.height = salesChart.value.offsetHeight;

  const padding = 40;
  const width = salesChart.value.width - padding * 2;
  const height = salesChart.value.height - padding * 2;

  const maxValue = Math.max(...data.values);
  const step = width / (data.labels.length - 1);

  // 繪製網格線
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + width, y);
    ctx.stroke();
  }

  // 繪製折線
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.values.forEach((value, index) => {
    const x = padding + step * index;
    const y = padding + height - (value / maxValue) * height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // 繪製數據點
  ctx.fillStyle = "#d97706";
  data.values.forEach((value, index) => {
    const x = padding + step * index;
    const y = padding + height - (value / maxValue) * height;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 繪製標籤
  ctx.fillStyle = "#6b7280";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";

  data.labels.forEach((label, index) => {
    const x = padding + step * index;
    ctx.fillText(label, x, padding + height + 20);
  });
};

onMounted(() => {
  // 延遲初始化圖表,確保 DOM 已渲染
  setTimeout(() => {
    initChart();
  }, 100);

  // 監聽視窗大小變化
  window.addEventListener("resize", initChart);
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
