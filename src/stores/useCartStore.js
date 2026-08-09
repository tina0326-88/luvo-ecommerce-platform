import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { loadFromStorage, saveToStorage } from "@/utils/helpers";

const CART_STORAGE_KEY = "luvo-cart";

/**
 * 購物車 Store
 *
 * 專案目前為純前端展示（未串接後端），購物車資料以 localStorage 持久化，
 * 對應 README 所述「購物車管理：即時更新、本地持久化」。
 *
 * 每一筆購物車項目以「商品 id + 尺寸 + 顏色」組成唯一的 lineId，
 * 讓同一件商品但不同規格能分別列成不同行，跟真實電商邏輯一致。
 */
export const useCartStore = defineStore("cart", () => {
  const items = ref(loadFromStorage(CART_STORAGE_KEY, []));

  const persist = () => {
    saveToStorage(CART_STORAGE_KEY, items.value);
  };

  const buildLineId = (product) => {
    return [product.id, product.size || "", product.color || ""].join("-");
  };

  // 購物車總件數（所有商品數量加總，用於 Header 上的購物車角標）
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // 購物車總金額
  const totalAmount = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  });

  // 判斷某商品（含規格）是否已在購物車中
  const isInCart = (product) => {
    const lineId = buildLineId(product);
    return items.value.some((item) => item.lineId === lineId);
  };

  // 加入購物車：若同商品同規格已存在，數量累加；否則新增一筆
  const addItem = (product, quantity = 1) => {
    const lineId = buildLineId(product);
    const existing = items.value.find((item) => item.lineId === lineId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({
        lineId,
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        size: product.size ?? null,
        color: product.color ?? null,
        stock: product.stock,
        quantity,
      });
    }

    persist();
  };

  // 更新指定項目的數量（CartItem.vue 的 update:quantity 事件對應這裡）
  const updateQuantity = ({ id, quantity, lineId }) => {
    const target = lineId
      ? items.value.find((item) => item.lineId === lineId)
      : items.value.find((item) => item.id === id);

    if (!target) return;

    if (quantity <= 0) {
      removeItem({ id, lineId });
      return;
    }

    target.quantity = quantity;
    persist();
  };

  // 移除項目（CartItem.vue 的 remove-request 事件，經父層確認後呼叫這裡）
  const removeItem = ({ id, lineId }) => {
    items.value = lineId
      ? items.value.filter((item) => item.lineId !== lineId)
      : items.value.filter((item) => item.id !== id);
    persist();
  };

  // 清空購物車（結帳完成後呼叫）
  const clearCart = () => {
    items.value = [];
    persist();
  };

  return {
    items,
    totalItems,
    totalAmount,
    isInCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
});