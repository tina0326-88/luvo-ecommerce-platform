<template>
    <div class="min-h-screen bg-gray-50">
      <!-- 麵包屑導航 -->
      <div class="bg-white border-b">
        <div class="container mx-auto px-4 py-4">
          <nav class="flex text-sm text-gray-600">
            <router-link to="/" class="hover:text-amber-800">首頁</router-link>
            <span class="mx-2">/</span>
            <span class="text-gray-900">購物車</span>
          </nav>
        </div>
      </div>
  
      <div class="container mx-auto px-4 py-8">
        <!-- 頁面標題 -->
        <h1 class="text-3xl font-bold text-gray-900 mb-8">購物車</h1>
  
        <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 左側：購物車項目列表 -->
          <div class="lg:col-span-2 space-y-4">
            <!-- 全選與批量操作 -->
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="handleSelectAll"
                    class="w-4 h-4 text-amber-800 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">
                    全選（{{ selectedItems.length }}/{{ cartItems.length }}）
                  </span>
                </label>
  
                <button
                  v-if="selectedItems.length > 0"
                  @click="handleBatchRemove"
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  刪除選中的商品
                </button>
              </div>
            </div>
  
            <!-- 購物車項目 -->
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="relative"
            >
              <!-- 選擇框 -->
              <div class="absolute left-2 top-6 z-10">
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedItems"
                  class="w-4 h-4 text-amber-800 focus:ring-amber-500 border-gray-300 rounded"
                />
              </div>
  
              <!-- 購物車項目元件 -->
              <div class="ml-8">
                <CartItem
                  :item="item"
                  :max-quantity="item.stock"
                  @update:quantity="handleUpdateQuantity"
                  @remove="handleRemoveItem"
                />
              </div>
            </div>
  
            <!-- 繼續購物 -->
            <div class="pt-4">
              <router-link
                to="/products"
                class="inline-flex items-center text-amber-800 hover:text-amber-900 font-medium"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                繼續購物
              </router-link>
            </div>
          </div>
  
          <!-- 右側：訂單摘要 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 class="text-lg font-bold text-gray-900 mb-4">訂單摘要</h2>
  
              <!-- 優惠券輸入 -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  優惠券代碼
                </label>
                <div class="flex gap-2">
                  <input
                    v-model="couponCode"
                    type="text"
                    placeholder="請輸入優惠券代碼"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    @click="handleApplyCoupon"
                    :disabled="!couponCode.trim()"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    套用
                  </button>
                </div>
                <p v-if="appliedCoupon" class="mt-2 text-sm text-green-600">
                   已套用優惠券：{{ appliedCoupon.code }}
                </p>
              </div>
  
              <div class="border-t border-gray-200 pt-4 space-y-3">
                <!-- 小計 -->
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">小計</span>
                  <span class="text-gray-900">${{ subtotal.toLocaleString() }}</span>
                </div>
  
                <!-- 運費 -->
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">運費</span>
                  <span class="text-gray-900">
                    {{ shippingFee === 0 ? '免運' : `$${shippingFee.toLocaleString()}` }}
                  </span>
                </div>
  
                <!-- 折扣 -->
                <div v-if="discount > 0" class="flex justify-between text-sm">
                  <span class="text-gray-600">優惠折抵</span>
                  <span class="text-green-600">-${{ discount.toLocaleString() }}</span>
                </div>
  
                <!-- 總計 -->
                <div class="border-t border-gray-200 pt-3">
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-gray-900">總計</span>
                    <span class="text-2xl font-bold text-amber-800">
                      ${{ total.toLocaleString() }}
                    </span>
                  </div>
                </div>
  
                <!-- 免運提示 -->
                <div v-if="subtotal < freeShippingThreshold" class="text-xs text-gray-600 bg-gray-50 rounded p-2">
                   再消費 ${{ (freeShippingThreshold - subtotal).toLocaleString() }} 即可享免運
                </div>
              </div>
  
              <!-- 結帳按鈕 -->
              <button
                @click="handleCheckout"
                :disabled="selectedItems.length === 0"
                class="w-full mt-6 px-6 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                前往結帳（{{ selectedItems.length }} 件商品）
              </button>
  
              <!-- 安全提示 -->
              <div class="mt-4 flex items-center justify-center text-xs text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                安全加密結帳
              </div>
            </div>
          </div>
        </div>
  
        <!-- 空購物車 -->
        <div v-else class="text-center py-16">
          <svg class="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">購物車是空的</h2>
          <p class="text-gray-600 mb-6">快去挑選喜歡的商品吧！</p>
          <router-link
            to="/products"
            class="inline-block px-6 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-colors"
          >
            開始購物
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import CartItem from '@/components/business/CartItem.vue'
  
  const router = useRouter()
  
  // 購物車資料（模擬）
  const cartItems = ref([
    {
      id: 1,
      name: '【Luvo】紳士格調經典牛津皮鞋',
      image: '/images/product-1.jpg',
      price: 6980,
      originalPrice: 6980,
      quantity: 1,
      size: '42',
      color: '黑色',
      stock: 10
    },
    {
      id: 2,
      name: '【Luvo】摩登時尚簡約牛津皮鞋',
      image: '/images/product-2.jpg',
      price: 4980,
      originalPrice: 5980,
      quantity: 2,
      size: '41',
      color: '咖啡色',
      stock: 3
    }
  ])
  
  // 選中的商品
  const selectedItems = ref([1, 2])
  const selectAll = ref(true)
  
  // 優惠券
  const couponCode = ref('')
  const appliedCoupon = ref(null)
  
  // 免運門檻
  const freeShippingThreshold = 3000
  
  // 小計（只計算選中的商品）
  const subtotal = computed(() => {
    return cartItems.value
      .filter(item => selectedItems.value.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  })
  
  // 運費
  const shippingFee = computed(() => {
    return subtotal.value >= freeShippingThreshold ? 0 : 100
  })
  
  // 折扣
  const discount = computed(() => {
    if (appliedCoupon.value) {
      if (appliedCoupon.value.type === 'percentage') {
        return Math.floor(subtotal.value * appliedCoupon.value.value / 100)
      } else if (appliedCoupon.value.type === 'fixed') {
        return appliedCoupon.value.value
      }
    }
    return 0
  })
  
  // 總計
  const total = computed(() => {
    return Math.max(0, subtotal.value + shippingFee.value - discount.value)
  })
  
  // 全選/取消全選
  const handleSelectAll = () => {
    if (selectAll.value) {
      selectedItems.value = cartItems.value.map(item => item.id)
    } else {
      selectedItems.value = []
    }
  }
  
  // 監聽選中項目變化
  computed(() => {
    selectAll.value = selectedItems.value.length === cartItems.value.length
  })
  
  // 更新商品數量
  const handleUpdateQuantity = ({ id, quantity }) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  }
  
  // 移除單個商品
  const handleRemoveItem = (id) => {
    const index = cartItems.value.findIndex(item => item.id === id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      // 同時移除選中狀態
      const selectedIndex = selectedItems.value.indexOf(id)
      if (selectedIndex > -1) {
        selectedItems.value.splice(selectedIndex, 1)
      }
    }
  }
  
  // 批量刪除
  const handleBatchRemove = () => {
    if (confirm(`確定要刪除選中的 ${selectedItems.value.length} 件商品嗎？`)) {
      cartItems.value = cartItems.value.filter(
        item => !selectedItems.value.includes(item.id)
      )
      selectedItems.value = []
    }
  }
  
  // 套用優惠券
  const handleApplyCoupon = () => {
    // 模擬優惠券驗證
    const coupons = {
      'WELCOME100': { code: 'WELCOME100', type: 'fixed', value: 100, desc: '新會員折扣 $100' },
      'SAVE10': { code: 'SAVE10', type: 'percentage', value: 10, desc: '全站 9 折' }
    }
  
    const coupon = coupons[couponCode.value.toUpperCase()]
    
    if (coupon) {
      appliedCoupon.value = coupon
      alert(` 優惠券套用成功！${coupon.desc}`)
    } else {
      alert(' 優惠券代碼無效')
    }
  }
  
  // 前往結帳
  const handleCheckout = () => {
    if (selectedItems.value.length === 0) {
      alert('請選擇要結帳的商品')
      return
    }
  
    // 傳遞選中的商品到結帳頁面
    const selectedProducts = cartItems.value.filter(
      item => selectedItems.value.includes(item.id)
    )
  
    router.push({
      name: 'Checkout',
      state: { items: selectedProducts }
    })
  }
  </script>
  
  <style scoped>
  /* 自訂樣式 */
  </style>