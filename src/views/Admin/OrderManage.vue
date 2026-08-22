<template>
  <div class="space-y-6">
    <!-- 狀態統計 -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
      <div
        v-for="stat in statusStats"
        :key="stat.key"
        class="bg-white rounded-xl shadow-md p-4 text-center"
      >
        <p class="text-2xl font-bold text-gray-800">{{ stat.count }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- 搜尋與篩選 -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[220px]">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >搜尋（訂單編號 / 客戶 / 電話）</label
          >
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="輸入關鍵字"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >狀態</label
          >
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">全部狀態</option>
            <option
              v-for="(config, key) in ORDER_STATUS_MAP"
              :key="key"
              :value="key"
            >
              {{ config.text }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >起始日期</label
          >
          <input
            v-model="filterDateFrom"
            type="date"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >結束日期</label
          >
          <input
            v-model="filterDateTo"
            type="date"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>

    <!-- 訂單列表 -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="text-left text-gray-500 border-b border-gray-200 bg-gray-50"
          >
            <th class="py-3 px-4">訂單編號</th>
            <th class="py-3 px-4">客戶</th>
            <th class="py-3 px-4">電話</th>
            <th class="py-3 px-4">金額</th>
            <th class="py-3 px-4">狀態</th>
            <th class="py-3 px-4">日期</th>
            <th class="py-3 px-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in pagedOrders"
            :key="order.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
          >
            <td class="py-3 px-4 font-medium text-gray-800">
              {{ order.orderNumber }}
            </td>
            <td class="py-3 px-4 text-gray-600">{{ order.customerName }}</td>
            <td class="py-3 px-4 text-gray-600">{{ order.customerPhone }}</td>
            <td class="py-3 px-4 font-medium text-amber-800">
              NT$ {{ formatPrice(order.totalAmount) }}
            </td>
            <td class="py-3 px-4">
              <select
                :value="order.status"
                @change="handleStatusChange(order, $event.target.value)"
                class="text-xs px-2 py-1 rounded-full border-0 font-bold text-white"
                :class="ORDER_STATUS_MAP[order.status]?.class"
              >
                <option
                  v-for="(config, key) in ORDER_STATUS_MAP"
                  :key="key"
                  :value="key"
                  class="text-gray-800 bg-white"
                >
                  {{ config.text }}
                </option>
              </select>
            </td>
            <td class="py-3 px-4 text-gray-500">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="py-3 px-4">
              <div class="flex gap-2 justify-end">
                <button
                  class="text-gray-500 hover:text-amber-800 text-xs font-medium"
                  @click="openDetailModal(order)"
                >
                  查看詳情
                </button>
                <button
                  class="text-gray-500 hover:text-amber-800 text-xs font-medium"
                  @click="handlePrint(order)"
                >
                  列印
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="pagedOrders.length === 0">
            <td colspan="7" class="py-12 text-center text-gray-400">
              找不到符合條件的訂單
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between">
      <BaseButton variant="outline" size="sm" @click="handleExport">
        匯出目前篩選結果（CSV）
      </BaseButton>
      <BasePagination
        v-if="filteredOrders.length > pageSize"
        v-model:current-page="currentPage"
        :total="filteredOrders.length"
        :page-size="pageSize"
      />
    </div>

    <!-- 訂單詳情 Modal -->
    <BaseModal
      v-model="showDetailModal"
      title="訂單詳情"
      size="lg"
      :show-footer="false"
    >
      <div v-if="detailOrder" class="space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500">訂單編號</p>
            <p class="font-medium text-gray-800">
              {{ detailOrder.orderNumber }}
            </p>
          </div>
          <div>
            <p class="text-gray-500">狀態</p>
            <span
              class="inline-block mt-1 px-2 py-1 text-xs font-bold rounded-full text-white"
              :class="ORDER_STATUS_MAP[detailOrder.status]?.class"
            >
              {{ ORDER_STATUS_MAP[detailOrder.status]?.text }}
            </span>
          </div>
          <div>
            <p class="text-gray-500">客戶</p>
            <p class="font-medium text-gray-800">
              {{ detailOrder.customerName }}
            </p>
          </div>
          <div>
            <p class="text-gray-500">電話</p>
            <p class="font-medium text-gray-800">
              {{ detailOrder.customerPhone }}
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">商品清單</p>
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in detailOrder.items"
              :key="item.id"
              class="flex justify-between py-2 text-sm"
            >
              <span class="text-gray-700"
                >{{ item.name }} × {{ item.quantity }}</span
              >
              <span class="font-medium text-gray-800"
                >NT$ {{ formatPrice(item.price * item.quantity) }}</span
              >
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4 flex justify-between">
          <span class="font-medium text-gray-800">合計</span>
          <span class="text-lg font-bold text-amber-800"
            >NT$ {{ formatPrice(detailOrder.totalAmount) }}</span
          >
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import BasePagination from "@/components/base/BasePagination.vue";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice, formatDate } from "@/utils/helpers";
import { ORDER_STATUS_MAP } from "@/utils/constants";

const orderStore = useOrderStore();

const searchKeyword = ref("");
const filterStatus = ref("");
const filterDateFrom = ref("");
const filterDateTo = ref("");
const currentPage = ref(1);
const pageSize = 10;

const statusStats = computed(() => {
  return Object.entries(ORDER_STATUS_MAP).map(([key, config]) => ({
    key,
    label: config.text,
    count: orderStore.countByStatus[key] || 0,
  }));
});

const filteredOrders = computed(() => {
  let result = orderStore.orders;

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(keyword) ||
        (o.customerName || "").toLowerCase().includes(keyword) ||
        (o.customerPhone || "").includes(keyword),
    );
  }
  if (filterStatus.value) {
    result = result.filter((o) => o.status === filterStatus.value);
  }
  if (filterDateFrom.value) {
    result = result.filter((o) => o.createdAt >= filterDateFrom.value);
  }
  if (filterDateTo.value) {
    result = result.filter((o) => o.createdAt <= filterDateTo.value);
  }

  return [...result].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
});

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredOrders.value.slice(start, start + pageSize);
});

// 後台可直接用下拉選單變更訂單狀態，不需要跟前台一樣走「意圖→Modal 確認」的流程，
// 因為這裡的操作者是管理員本人，屬於管理行為而非消費者不可逆的操作
const handleStatusChange = (order, newStatus) => {
  orderStore.updateStatus(order.id, newStatus);
};

const showDetailModal = ref(false);
const detailOrder = ref(null);
const openDetailModal = (order) => {
  detailOrder.value = order;
  showDetailModal.value = true;
};

const handlePrint = (order) => {
  // TODO: 尚未實作實際列印版面，暫時開啟瀏覽器列印對話框
  window.print();
};

const handleExport = () => {
  // 匯出目前篩選結果為 CSV，純前端產生，不經過後端
  const headers = ["訂單編號", "客戶", "電話", "金額", "狀態", "日期"];
  const rows = filteredOrders.value.map((o) => [
    o.orderNumber,
    o.customerName,
    o.customerPhone,
    o.totalAmount,
    ORDER_STATUS_MAP[o.status]?.text || o.status,
    o.createdAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // 加上 BOM 避免 Excel 開啟中文 CSV 時出現亂碼
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>
