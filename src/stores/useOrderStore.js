import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  loadFromStorage,
  saveToStorage,
  generateOrderNumber,
} from "@/utils/helpers";

const ORDERS_STORAGE_KEY = "luvo-orders";

// 找不到既有訂單資料時使用的預設值（第一次使用時的展示資料）
const DEFAULT_ORDERS = [
  {
    id: 1,
    orderNumber: "LV20260710-1042",
    status: "pending",
    createdAt: "2026-07-10",
    trackingNumber: null,
    hasReviewed: false,
    totalAmount: 6980,
    items: [
      {
        id: 1,
        productId: 1,
        name: "紳士格調經典牛津皮鞋",
        image: "/images/product-1.jpg",
        quantity: 1,
        price: 6980,
      },
    ],
  },
  {
    id: 2,
    orderNumber: "LV20260705-3387",
    status: "processing",
    createdAt: "2026-07-05",
    trackingNumber: null,
    hasReviewed: false,
    totalAmount: 12660,
    items: [
      {
        id: 2,
        productId: 5,
        name: "都會型男樂福鞋",
        image: "/images/product-5.jpg",
        quantity: 1,
        price: 5400,
      },
      {
        id: 3,
        productId: 102,
        name: "工裝馬丁靴",
        image: "/images/product-11.jpg",
        quantity: 1,
        price: 7260,
      },
    ],
  },
  {
    id: 3,
    orderNumber: "LV20260628-8821",
    status: "shipped",
    createdAt: "2026-06-28",
    trackingNumber: "TW1234567890",
    hasReviewed: false,
    totalAmount: 8980,
    items: [
      {
        id: 4,
        productId: 101,
        name: "經典切爾西靴",
        image: "/images/product-10.jpg",
        quantity: 1,
        price: 8980,
      },
    ],
  },
  {
    id: 4,
    orderNumber: "LV20260610-1195",
    status: "completed",
    createdAt: "2026-06-10",
    trackingNumber: "TW1234567800",
    hasReviewed: false,
    totalAmount: 3980,
    items: [
      {
        id: 5,
        productId: 201,
        name: "時尚休閒運動鞋",
        image: "/images/casual-1.jpg",
        quantity: 1,
        price: 3980,
      },
    ],
  },
  {
    id: 5,
    orderNumber: "LV20260528-4470",
    status: "completed",
    createdAt: "2026-05-28",
    trackingNumber: "TW1234567711",
    hasReviewed: true,
    totalAmount: 4980,
    items: [
      {
        id: 6,
        productId: 2,
        name: "摩登時尚簡約牛津皮鞋",
        image: "/images/product-2.jpg",
        quantity: 1,
        price: 4980,
      },
    ],
  },
  {
    id: 6,
    orderNumber: "LV20260510-7734",
    status: "cancelled",
    createdAt: "2026-05-10",
    trackingNumber: null,
    hasReviewed: false,
    totalAmount: 6280,
    items: [
      {
        id: 7,
        productId: 103,
        name: "經典沙漠靴",
        image: "/images/product-12.jpg",
        quantity: 1,
        price: 6280,
      },
    ],
  },
];

export const useOrderStore = defineStore("order", () => {
  const orders = ref(loadFromStorage(ORDERS_STORAGE_KEY, DEFAULT_ORDERS));

  const persist = () => {
    saveToStorage(ORDERS_STORAGE_KEY, orders.value);
  };

  const getOrderById = (id) => {
    const numericId = Number(id);
    return orders.value.find((order) => order.id === numericId) || null;
  };

  // 依狀態統計數量，後台儀表板 / 訂單管理頁可直接使用
  const countByStatus = computed(() => {
    const counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    };
    orders.value.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status] += 1;
      }
    });
    return counts;
  });

  // 從購物車結帳建立新訂單
  const createOrder = ({ items, totalAmount }) => {
    const newOrder = {
      id: Math.max(0, ...orders.value.map((o) => o.id)) + 1,
      orderNumber: generateOrderNumber(),
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
      trackingNumber: null,
      hasReviewed: false,
      totalAmount,
      items,
    };
    orders.value.unshift(newOrder);
    persist();
    return newOrder;
  };

  const updateStatus = (id, status) => {
    const order = getOrderById(id);
    if (!order) return;
    order.status = status;
    persist();
  };

  const cancelOrder = (id) => {
    updateStatus(id, "cancelled");
  };

  const confirmReceipt = (id) => {
    updateStatus(id, "completed");
  };

  const markReviewed = (id) => {
    const order = getOrderById(id);
    if (!order) return;
    order.hasReviewed = true;
    persist();
  };

  return {
    orders,
    countByStatus,
    getOrderById,
    createOrder,
    updateStatus,
    cancelOrder,
    confirmReceipt,
    markReviewed,
  };
});
