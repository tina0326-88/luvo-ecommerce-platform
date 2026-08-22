<template>
  <div class="space-y-6">
    <!-- 數據卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white rounded-xl shadow-md p-5"
      >
        <p class="text-sm text-gray-500 mb-1">{{ stat.label }}</p>
        <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
        <p
          v-if="stat.growth !== undefined"
          class="text-xs mt-1"
          :class="stat.growth >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ stat.growth >= 0 ? "▲" : "▼" }} {{ Math.abs(stat.growth) }}% 較上月
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 銷售趨勢 -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">近 7 日銷售趨勢</h2>
        <div class="flex items-end gap-3 h-48">
          <div
            v-for="day in salesTrend"
            :key="day.date"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <span class="text-xs text-gray-500"
              >NT$ {{ formatPrice(day.amount) }}</span
            >
            <div
              class="w-full bg-amber-800 rounded-t-md transition-all"
              :style="{
                height: `${day.heightPercent}%`,
                minHeight: day.amount > 0 ? '4px' : '0px',
              }"
            ></div>
            <span class="text-xs text-gray-400">{{ day.label }}</span>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-4">
          * 展示用資料，依目前訂單建立日期統計，非真實每日銷售額
        </p>
      </div>

      <!-- 熱銷商品 TOP 5 -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">熱銷商品 TOP 5</h2>
        <div v-if="topProducts.length" class="space-y-4">
          <div
            v-for="(item, index) in topProducts"
            :key="item.productId"
            class="flex items-center gap-3"
          >
            <span
              class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0"
              :class="
                index === 0
                  ? 'bg-amber-800 text-white'
                  : 'bg-gray-100 text-gray-500'
              "
            >
              {{ index + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ item.name }}
              </p>
              <p class="text-xs text-gray-500">售出 {{ item.quantity }} 件</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">目前尚無銷售紀錄</p>
      </div>
    </div>

    <!-- 最近訂單 -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-800">最近訂單</h2>
        <router-link
          to="/admin/orders"
          class="text-sm text-amber-800 hover:underline"
        >
          查看全部
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="py-2 pr-4">訂單編號</th>
              <th class="py-2 pr-4">客戶</th>
              <th class="py-2 pr-4">金額</th>
              <th class="py-2 pr-4">狀態</th>
              <th class="py-2">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="border-b border-gray-100 last:border-0"
            >
              <td class="py-3 pr-4">
                <router-link
                  :to="`/admin/orders?highlight=${order.orderNumber}`"
                  class="text-gray-800 hover:text-amber-800"
                >
                  {{ order.orderNumber }}
                </router-link>
              </td>
              <td class="py-3 pr-4 text-gray-600">{{ order.customerName }}</td>
              <td class="py-3 pr-4 font-medium text-amber-800">
                NT$ {{ formatPrice(order.totalAmount) }}
              </td>
              <td class="py-3 pr-4">
                <span
                  class="px-2 py-1 text-xs font-bold rounded-full text-white"
                  :class="ORDER_STATUS_MAP[order.status]?.class"
                >
                  {{ ORDER_STATUS_MAP[order.status]?.text }}
                </span>
              </td>
              <td class="py-3 text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOrderStore } from "@/stores/useOrderStore";
import { useProductStore } from "@/stores/useProductStore";
import { formatPrice, formatDate } from "@/utils/helpers";
import { ORDER_STATUS_MAP } from "@/utils/constants";

const orderStore = useOrderStore();
const productStore = useProductStore();

// 已取消的訂單不計入業績統計
const validOrders = computed(() =>
  orderStore.orders.filter((o) => o.status !== "cancelled"),
);

const totalSales = computed(() =>
  validOrders.value.reduce((sum, o) => sum + o.totalAmount, 0),
);

// 會員數目前沒有對應的會員清單 store（專案僅有單一模擬帳號），
// 這裡先用靜態展示數字，之後若擴充多帳號機制可改為動態計算
const MOCK_MEMBER_COUNT = 128;

const growthRates = { sales: 12.5, orders: 8.2, products: 4.1, members: 6.7 };

const statCards = computed(() => [
  {
    label: "總銷售額",
    value: `NT$ ${formatPrice(totalSales.value)}`,
    growth: growthRates.sales,
  },
  {
    label: "訂單數",
    value: validOrders.value.length,
    growth: growthRates.orders,
  },
  {
    label: "商品數",
    value: productStore.totalCount,
    growth: growthRates.products,
  },
  { label: "會員數", value: MOCK_MEMBER_COUNT, growth: growthRates.members },
]);

// 依訂單建立日期彙總近 7 日銷售額（含當天無訂單的日期，顯示為 0）
const salesTrend = computed(() => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);

    const amount = validOrders.value
      .filter((o) => o.createdAt === dateStr)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    days.push({
      date: dateStr,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      amount,
    });
  }

  const max = Math.max(...days.map((d) => d.amount), 1);
  return days.map((d) => ({ ...d, heightPercent: (d.amount / max) * 100 }));
});

// 熱銷商品：彙總所有有效訂單中的商品購買數量，取前 5 名
const topProducts = computed(() => {
  const countMap = new Map();

  validOrders.value.forEach((order) => {
    order.items.forEach((item) => {
      const key = item.productId ?? item.id;
      const existing = countMap.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        countMap.set(key, {
          productId: key,
          name: item.name,
          quantity: item.quantity,
        });
      }
    });
  });

  return [...countMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
});

const recentOrders = computed(() =>
  [...orderStore.orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5),
);
</script>
