import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  // ============ State ============
  const items = ref([]);
  const isCartOpen = ref(false);
  const selectedCoupon = ref(null);

  // ============ Getters ============

  // 購物車商品數量
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  // 購物車總價（未折扣）
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  });

  // 折扣金額
  const discountAmount = computed(() => {
    if (!selectedCoupon.value) return 0;

    if (selectedCoupon.value.type === "percentage") {
      return subtotal.value * (selectedCoupon.value.value / 100);
    } else {
      return selectedCoupon.value.value;
    }
  });

  // 運費（滿3000免運）
  const shippingFee = computed(() => {
    return subtotal.value >= 3000 ? 0 : 100;
  });

  // 最終總價
  const total = computed(() => {
    return Math.max(
      0,
      subtotal.value - discountAmount.value + shippingFee.value
    );
  });

  // 是否可以結帳
  const canCheckout = computed(() => {
    return items.value.length > 0;
  });

  // 距離免運還差多少
  const amountToFreeShipping = computed(() => {
    return Math.max(0, 3000 - subtotal.value);
  });

  // ============ Actions ============

  // 加入購物車
  const addItem = (product, selectedSize = null, selectedColor = null) => {
    const existingItem = items.value.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItem) {
      // 如果商品已存在，增加數量
      existingItem.quantity++;

      // 顯示通知
      showNotification(
        `已將 ${product.name} 數量增加至 ${existingItem.quantity}`
      );
    } else {
      // 新增商品
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.discount
          ? product.price * (1 - product.discount / 100)
          : product.price,
        originalPrice: product.price,
        discount: product.discount,
        icon: product.icon,
        category: product.category,
        selectedSize: selectedSize || (product.sizes ? product.sizes[0] : null),
        selectedColor:
          selectedColor || (product.colors ? product.colors[0] : null),
        quantity: 1,
        stock: product.stock,
      });

      showNotification(`已將 ${product.name} 加入購物車`);
    }

    // 自動打開購物車側邊欄（延遲一下讓動畫更流暢）
    setTimeout(() => {
      isCartOpen.value = true;
    }, 100);

    // 儲存到 localStorage
    saveToLocalStorage();
  };

  // 更新商品數量
  const updateQuantity = (itemId, quantity, size, color) => {
    const item = items.value.find(
      (i) =>
        i.id === itemId && i.selectedSize === size && i.selectedColor === color
    );

    if (item) {
      if (quantity <= 0) {
        removeItem(itemId, size, color);
      } else if (quantity <= item.stock) {
        item.quantity = quantity;
        saveToLocalStorage();
      } else {
        showNotification(`庫存不足，目前僅剩 ${item.stock} 件`, "error");
      }
    }
  };

  // 增加數量
  const incrementQuantity = (itemId, size, color) => {
    const item = items.value.find(
      (i) =>
        i.id === itemId && i.selectedSize === size && i.selectedColor === color
    );

    if (item) {
      if (item.quantity < item.stock) {
        item.quantity++;
        saveToLocalStorage();
      } else {
        showNotification(`已達庫存上限（${item.stock} 件）`, "warning");
      }
    }
  };

  // 減少數量
  const decrementQuantity = (itemId, size, color) => {
    const item = items.value.find(
      (i) =>
        i.id === itemId && i.selectedSize === size && i.selectedColor === color
    );

    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        saveToLocalStorage();
      } else {
        // 數量為 1 時，詢問是否刪除
        if (confirm("確定要從購物車移除此商品嗎？")) {
          removeItem(itemId, size, color);
        }
      }
    }
  };

  // 移除商品
  const removeItem = (itemId, size, color) => {
    const index = items.value.findIndex(
      (i) =>
        i.id === itemId && i.selectedSize === size && i.selectedColor === color
    );

    if (index > -1) {
      const item = items.value[index];
      items.value.splice(index, 1);
      showNotification(`已移除 ${item.name}`);
      saveToLocalStorage();
    }
  };

  // 清空購物車
  const clearCart = () => {
    if (items.value.length === 0) return;

    if (confirm("確定要清空購物車嗎？")) {
      items.value = [];
      selectedCoupon.value = null;
      showNotification("購物車已清空");
      saveToLocalStorage();
    }
  };

  // 應用優惠券
  const applyCoupon = (coupon) => {
    // 檢查最低消費金額
    if (coupon.minAmount && subtotal.value < coupon.minAmount) {
      showNotification(
        `此優惠券需消費滿 $${coupon.minAmount.toLocaleString("zh-TW")}`,
        "error"
      );
      return false;
    }

    selectedCoupon.value = coupon;
    showNotification(`已套用優惠券：${coupon.name}`, "success");
    return true;
  };

  // 移除優惠券
  const removeCoupon = () => {
    selectedCoupon.value = null;
    showNotification("已移除優惠券");
  };

  // 切換購物車側邊欄
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  // 開啟購物車
  const openCart = () => {
    isCartOpen.value = true;
  };

  // 關閉購物車
  const closeCart = () => {
    isCartOpen.value = false;
  };

  // 檢查商品是否在購物車中
  const isInCart = (productId) => {
    return items.value.some((item) => item.id === productId);
  };

  // 取得商品在購物車中的數量
  const getItemQuantity = (productId) => {
    const item = items.value.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  // ============ 本地儲存 ============

  // 儲存到 localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(items.value));
      if (selectedCoupon.value) {
        localStorage.setItem(
          "selectedCoupon",
          JSON.stringify(selectedCoupon.value)
        );
      } else {
        localStorage.removeItem("selectedCoupon");
      }
    } catch (error) {
      console.error("儲存購物車失敗:", error);
    }
  };

  // 從 localStorage 載入
  const loadFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        items.value = JSON.parse(savedCart);
      }

      const savedCoupon = localStorage.getItem("selectedCoupon");
      if (savedCoupon) {
        selectedCoupon.value = JSON.parse(savedCoupon);
      }
    } catch (error) {
      console.error("載入購物車失敗:", error);
    }
  };

  // ============ 通知系統 ============

  const notifications = ref([]);
  let notificationId = 0;

  const showNotification = (message, type = "success") => {
    const id = notificationId++;
    notifications.value.push({
      id,
      message,
      type,
    });

    // 3 秒後自動移除通知
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // ============ 初始化 ============

  // 載入本地儲存的資料
  loadFromLocalStorage();

  // ============ Return ============

  return {
    // State
    items,
    isCartOpen,
    selectedCoupon,
    notifications,

    // Getters
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    canCheckout,
    amountToFreeShipping,

    // Actions
    addItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleCart,
    openCart,
    closeCart,
    isInCart,
    getItemQuantity,
    showNotification,
    removeNotification,
    loadFromLocalStorage,
  };
});
