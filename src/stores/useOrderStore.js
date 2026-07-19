// stores/useOrderStore.js
import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", {
  state: () => ({
    // 訂單列表
    orders: [],

    // 當前訂單
    currentOrder: null,

    // Loading 狀態
    loading: false,

    // 錯誤訊息
    error: null,

    // 訂單統計
    statistics: {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
    },

    // 結帳資料
    checkout: {
      items: [],
      shippingAddress: null,
      billingAddress: null,
      paymentMethod: null,
      shippingMethod: null,
      coupon: null,
      note: "",
    },
  }),

  getters: {
    // 取得所有訂單
    allOrders: (state) => state.orders,

    // 依狀態篩選訂單
    ordersByStatus: (state) => (status) => {
      if (status === "all") return state.orders;
      return state.orders.filter((order) => order.status === status);
    },

    // 待付款訂單
    pendingOrders: (state) => {
      return state.orders.filter((order) => order.status === "pending");
    },

    // 處理中訂單
    processingOrders: (state) => {
      return state.orders.filter((order) => order.status === "processing");
    },

    // 待收貨訂單
    shippedOrders: (state) => {
      return state.orders.filter((order) => order.status === "shipped");
    },

    // 已完成訂單
    completedOrders: (state) => {
      return state.orders.filter((order) => order.status === "completed");
    },

    // 取得訂單總額
    totalAmount: (state) => {
      return state.orders.reduce((sum, order) => sum + order.total, 0);
    },

    // 結帳商品數量
    checkoutItemCount: (state) => {
      return state.checkout.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    // 結帳小計
    checkoutSubtotal: (state) => {
      return state.checkout.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
    },

    // 結帳運費
    checkoutShippingFee: (state) => {
      if (!state.checkout.shippingMethod) return 0;
      return state.checkout.shippingMethod.fee || 0;
    },

    // 結帳折扣
    checkoutDiscount: (state) => {
      if (!state.checkout.coupon) return 0;

      const subtotal = state.checkout.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      if (state.checkout.coupon.type === "percentage") {
        return Math.floor((subtotal * state.checkout.coupon.value) / 100);
      } else if (state.checkout.coupon.type === "fixed") {
        return state.checkout.coupon.value;
      }

      return 0;
    },

    // 結帳總計
    checkoutTotal: (state, getters) => {
      return Math.max(
        0,
        getters.checkoutSubtotal +
          getters.checkoutShippingFee -
          getters.checkoutDiscount
      );
    },

    // 是否正在載入
    isLoading: (state) => state.loading,

    // 是否有錯誤
    hasError: (state) => state.error !== null,
  },

  actions: {
    // ==================== 訂單管理 ====================

    // 獲取訂單列表
    async fetchOrders() {
      this.loading = true;
      this.error = null;

      try {
        // TODO: 實際的 API 呼叫
        // const response = await fetch('/api/orders')
        // const data = await response.json()

        // 模擬 API 請求
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 模擬資料
        this.orders = [
          {
            id: 1,
            orderNumber: "ORD20240103001",
            status: "completed",
            createdAt: "2024-01-03 14:30",
            items: [
              {
                id: 1,
                productId: 1,
                name: "【Luvo】紳士格調經典牛津皮鞋",
                image: "/images/product-1.jpg",
                price: 6980,
                quantity: 1,
                size: "42",
                color: "黑色",
              },
            ],
            subtotal: 6980,
            shippingFee: 0,
            discount: 0,
            total: 6980,
            shippingAddress: {
              name: "王小明",
              phone: "0912345678",
              address: "106 台北市大安區忠孝東路四段 123 號 5 樓",
            },
            paymentMethod: "credit_card",
            trackingNumber: null,
            reviewed: false,
          },
        ];

        this.updateStatistics();
      } catch (error) {
        this.error = error.message;
        console.error("獲取訂單失敗:", error);
      } finally {
        this.loading = false;
      }
    },

    // 獲取單一訂單
    async fetchOrder(orderId) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: 實際的 API 呼叫
        // const response = await fetch(`/api/orders/${orderId}`)
        // const data = await response.json()

        await new Promise((resolve) => setTimeout(resolve, 500));

        const order = this.orders.find((o) => o.id === orderId);
        this.currentOrder = order || null;

        return order;
      } catch (error) {
        this.error = error.message;
        console.error("獲取訂單失敗:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 建立訂單
    async createOrder(orderData) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: 實際的 API 呼叫
        // const response = await fetch('/api/orders', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(orderData)
        // })
        // const data = await response.json()

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 模擬建立訂單
        const newOrder = {
          id: Date.now(),
          orderNumber: `ORD${Date.now()}`,
          status: "pending",
          createdAt: new Date().toLocaleString("zh-TW"),
          ...orderData,
        };

        this.orders.unshift(newOrder);
        this.updateStatistics();

        return newOrder;
      } catch (error) {
        this.error = error.message;
        console.error("建立訂單失敗:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新訂單狀態
    async updateOrderStatus(orderId, status) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: 實際的 API 呼叫
        await new Promise((resolve) => setTimeout(resolve, 500));

        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = status;
          this.updateStatistics();
        }

        return order;
      } catch (error) {
        this.error = error.message;
        console.error("更新訂單狀態失敗:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 取消訂單
    async cancelOrder(orderId, reason = "") {
      return this.updateOrderStatus(orderId, "cancelled");
    },

    // 確認收貨
    async confirmReceipt(orderId) {
      return this.updateOrderStatus(orderId, "completed");
    },

    // 申請退款
    async requestRefund(orderId, reason = "") {
      this.loading = true;
      this.error = null;

      try {
        // TODO: 實際的 API 呼叫
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = "refunded";
          order.refundReason = reason;
          this.updateStatistics();
        }

        return order;
      } catch (error) {
        this.error = error.message;
        console.error("申請退款失敗:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 刪除訂單
    async deleteOrder(orderId) {
      try {
        const index = this.orders.findIndex((o) => o.id === orderId);
        if (index > -1) {
          this.orders.splice(index, 1);
          this.updateStatistics();
        }
      } catch (error) {
        this.error = error.message;
        console.error("刪除訂單失敗:", error);
      }
    },

    // 更新訂單統計
    updateStatistics() {
      this.statistics.total = this.orders.length;
      this.statistics.pending = this.orders.filter(
        (o) => o.status === "pending"
      ).length;
      this.statistics.processing = this.orders.filter(
        (o) => o.status === "processing"
      ).length;
      this.statistics.shipped = this.orders.filter(
        (o) => o.status === "shipped"
      ).length;
      this.statistics.completed = this.orders.filter(
        (o) => o.status === "completed"
      ).length;
      this.statistics.cancelled = this.orders.filter(
        (o) => o.status === "cancelled"
      ).length;
      this.statistics.refunded = this.orders.filter(
        (o) => o.status === "refunded"
      ).length;
    },

    // ==================== 結帳流程 ====================

    // 初始化結帳
    initCheckout(items) {
      this.checkout.items = items.map((item) => ({ ...item }));
    },

    // 設定收件地址
    setShippingAddress(address) {
      this.checkout.shippingAddress = address;
    },

    // 設定帳單地址
    setBillingAddress(address) {
      this.checkout.billingAddress = address;
    },

    // 設定付款方式
    setPaymentMethod(method) {
      this.checkout.paymentMethod = method;
    },

    // 設定運送方式
    setShippingMethod(method) {
      this.checkout.shippingMethod = method;
    },

    // 套用優惠券
    applyCoupon(coupon) {
      this.checkout.coupon = coupon;
    },

    // 移除優惠券
    removeCoupon() {
      this.checkout.coupon = null;
    },

    // 設定訂單備註
    setOrderNote(note) {
      this.checkout.note = note;
    },

    // 完成結帳
    async completeCheckout() {
      this.loading = true;
      this.error = null;

      try {
        const orderData = {
          items: this.checkout.items,
          shippingAddress: this.checkout.shippingAddress,
          billingAddress:
            this.checkout.billingAddress || this.checkout.shippingAddress,
          paymentMethod: this.checkout.paymentMethod,
          shippingMethod: this.checkout.shippingMethod,
          coupon: this.checkout.coupon,
          note: this.checkout.note,
          subtotal: this.checkoutSubtotal,
          shippingFee: this.checkoutShippingFee,
          discount: this.checkoutDiscount,
          total: this.checkoutTotal,
        };

        const order = await this.createOrder(orderData);
        this.clearCheckout();

        return order;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清除結帳資料
    clearCheckout() {
      this.checkout = {
        items: [],
        shippingAddress: null,
        billingAddress: null,
        paymentMethod: null,
        shippingMethod: null,
        coupon: null,
        note: "",
      };
    },

    // ==================== 其他功能 ====================

    // 再次購買
    async reorder(orderId) {
      const order = this.orders.find((o) => o.id === orderId);
      if (!order) return;

      // 將訂單商品加入購物車
      // TODO: 整合購物車 Store
      return order.items;
    },

    // 清除錯誤訊息
    clearError() {
      this.error = null;
    },
  },
});
