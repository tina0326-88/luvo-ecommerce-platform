<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">商品管理</h1>
            <p class="text-gray-600 mt-2">管理所有商品資訊、庫存和狀態</p>
          </div>
          <button
            @click="openCreateModal"
            class="px-6 py-3 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            新增商品
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 篩選和搜尋區 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 搜尋 -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >搜尋商品</label
            >
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="輸入商品名稱或編號..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- 分類篩選 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品分類</label
            >
            <select
              v-model="filterCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">全部分類</option>
              <option value="leather-shoes">皮鞋</option>
              <option value="casual-shoes">休閒鞋</option>
              <option value="boots">靴子</option>
              <option value="accessories">配件</option>
            </select>
          </div>

          <!-- 狀態篩選 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品狀態</label
            >
            <select
              v-model="filterStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">全部狀態</option>
              <option value="active">上架中</option>
              <option value="inactive">已下架</option>
              <option value="out-of-stock">缺貨</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    :checked="isAllSelected"
                    class="w-4 h-4 text-amber-800 border-gray-300 rounded focus:ring-amber-500"
                  />
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  商品資訊
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  分類
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  價格
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  庫存
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  銷量
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  狀態
                </th>
                <th
                  class="text-left py-4 px-6 text-gray-600 font-medium text-sm"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-6">
                  <input
                    type="checkbox"
                    :checked="selectedProducts.includes(product.id)"
                    @change="toggleSelectProduct(product.id)"
                    class="w-4 h-4 text-amber-800 border-gray-300 rounded focus:ring-amber-500"
                  />
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-4">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p class="font-medium text-gray-800">
                        {{ product.name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        編號: {{ product.sku }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600">
                  {{ getCategoryName(product.category) }}
                </td>
                <td class="py-4 px-6">
                  <p class="font-medium text-gray-800">
                    NT$ {{ formatNumber(product.price) }}
                  </p>
                  <p
                    v-if="product.originalPrice"
                    class="text-sm text-gray-400 line-through"
                  >
                    NT$ {{ formatNumber(product.originalPrice) }}
                  </p>
                </td>
                <td class="py-4 px-6">
                  <span
                    :class="[
                      'font-medium',
                      product.stock > 10
                        ? 'text-green-600'
                        : product.stock > 0
                          ? 'text-yellow-600'
                          : 'text-red-600',
                    ]"
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600">
                  {{ product.sold }}
                </td>
                <td class="py-4 px-6">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getStatusClass(product.status),
                    ]"
                  >
                    {{ getStatusText(product.status) }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editProduct(product)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="編輯"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="toggleProductStatus(product)"
                      class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      :title="product.status === 'active' ? '下架' : '上架'"
                    >
                      <svg
                        v-if="product.status === 'active'"
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteProduct(product)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="刪除"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分頁 -->
        <div
          class="px-6 py-4 border-t border-gray-100 flex items-center justify-between"
        >
          <p class="text-sm text-gray-600">
            顯示 {{ (currentPage - 1) * pageSize + 1 }} 至
            {{
              Math.min(currentPage * pageSize, filteredProducts.length)
            }}
            筆,共 {{ filteredProducts.length }} 筆
          </p>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一頁
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 border rounded-lg',
                currentPage === page
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯/新增商品 Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ editingProduct ? "編輯商品" : "新增商品" }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProduct" class="p-6 space-y-6">
          <!-- 商品名稱 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品名稱 *</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="請輸入商品名稱"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <!-- 商品編號 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品編號 *</label
            >
            <input
              v-model="formData.sku"
              type="text"
              required
              placeholder="請輸入商品編號"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <!-- 分類和狀態 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >商品分類 *</label
              >
              <select
                v-model="formData.category"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">請選擇分類</option>
                <option value="leather-shoes">皮鞋</option>
                <option value="casual-shoes">休閒鞋</option>
                <option value="boots">靴子</option>
                <option value="accessories">配件</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >商品狀態 *</label
              >
              <select
                v-model="formData.status"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="active">上架中</option>
                <option value="inactive">已下架</option>
                <option value="out-of-stock">缺貨</option>
              </select>
            </div>
          </div>

          <!-- 價格 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >售價 *</label
              >
              <input
                v-model.number="formData.price"
                type="number"
                required
                min="0"
                placeholder="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >原價</label
              >
              <input
                v-model.number="formData.originalPrice"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- 庫存 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >庫存數量 *</label
            >
            <input
              v-model.number="formData.stock"
              type="number"
              required
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <!-- 商品圖片 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品圖片</label
            >
            <input
              v-model="formData.image"
              type="text"
              placeholder="請輸入圖片網址"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <!-- 商品描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品描述</label
            >
            <textarea
              v-model="formData.description"
              rows="4"
              placeholder="請輸入商品描述"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- 按鈕 -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
            >
              {{ editingProduct ? "更新" : "新增" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 商品列表
const products = ref([
  {
    id: 1,
    name: "紳士格調經典牛津皮鞋",
    sku: "LUVO-LS-001",
    category: "leather-shoes",
    price: 6980,
    originalPrice: 7980,
    stock: 45,
    sold: 156,
    status: "active",
    image: "/images/product-1.jpg",
    description: "經典牛津設計，展現紳士風範",
  },
  {
    id: 2,
    name: "摩登時尚簡約牛津皮鞋",
    sku: "LUVO-LS-002",
    category: "leather-shoes",
    price: 4980,
    originalPrice: null,
    stock: 32,
    sold: 134,
    status: "active",
    image: "/images/product-2.jpg",
    description: "簡約時尚設計，適合各種場合",
  },
  {
    id: 3,
    name: "復古風範雕花牛津皮鞋",
    sku: "LUVO-LS-003",
    category: "leather-shoes",
    price: 7980,
    originalPrice: 8980,
    stock: 8,
    sold: 98,
    status: "active",
    image: "/images/product-3.jpg",
    description: "精緻雕花工藝，展現復古魅力",
  },
  {
    id: 4,
    name: "商務精英德比皮鞋",
    sku: "LUVO-LS-004",
    category: "leather-shoes",
    price: 5980,
    originalPrice: null,
    stock: 0,
    sold: 87,
    status: "out-of-stock",
    image: "/images/product-4.jpg",
    description: "商務首選，舒適耐穿",
  },
  {
    id: 5,
    name: "都會型男樂福鞋",
    sku: "LUVO-CS-001",
    category: "casual-shoes",
    price: 5400,
    originalPrice: null,
    stock: 28,
    sold: 76,
    status: "active",
    image: "/images/product-5.jpg",
    description: "輕鬆穿脫，舒適好搭",
  },
]);

// 篩選和搜尋
const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");

// 已選擇的商品
const selectedProducts = ref([]);

// 分頁
const currentPage = ref(1);
const pageSize = ref(10);

// Modal 狀態
const showModal = ref(false);
const editingProduct = ref(null);
const formData = ref({
  name: "",
  sku: "",
  category: "",
  price: 0,
  originalPrice: null,
  stock: 0,
  status: "active",
  image: "",
  description: "",
});

// 計算過濾後的商品
const filteredProducts = computed(() => {
  let result = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    );
  }

  if (filterCategory.value) {
    result = result.filter((p) => p.category === filterCategory.value);
  }

  if (filterStatus.value) {
    result = result.filter((p) => p.status === filterStatus.value);
  }

  return result;
});

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value);
});

// 是否全選
const isAllSelected = computed(() => {
  return (
    selectedProducts.value.length === filteredProducts.value.length &&
    filteredProducts.value.length > 0
  );
});

// 格式化數字
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 獲取分類名稱
const getCategoryName = (category) => {
  const categories = {
    "leather-shoes": "皮鞋",
    "casual-shoes": "休閒鞋",
    boots: "靴子",
    accessories: "配件",
  };
  return categories[category] || category;
};

// 獲取狀態樣式
const getStatusClass = (status) => {
  const classes = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    "out-of-stock": "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

// 獲取狀態文字
const getStatusText = (status) => {
  const texts = {
    active: "上架中",
    inactive: "已下架",
    "out-of-stock": "缺貨",
  };
  return texts[status] || status;
};

// 全選/取消全選
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProducts.value = [];
  } else {
    selectedProducts.value = filteredProducts.value.map((p) => p.id);
  }
};

// 選擇/取消選擇商品
const toggleSelectProduct = (id) => {
  const index = selectedProducts.value.indexOf(id);
  if (index > -1) {
    selectedProducts.value.splice(index, 1);
  } else {
    selectedProducts.value.push(id);
  }
};

// 開啟新增 Modal
const openCreateModal = () => {
  editingProduct.value = null;
  formData.value = {
    name: "",
    sku: "",
    category: "",
    price: 0,
    originalPrice: null,
    stock: 0,
    status: "active",
    image: "",
    description: "",
  };
  showModal.value = true;
};

// 編輯商品
const editProduct = (product) => {
  editingProduct.value = product;
  formData.value = { ...product };
  showModal.value = true;
};

// 關閉 Modal
const closeModal = () => {
  showModal.value = false;
  editingProduct.value = null;
};

// 儲存商品
const saveProduct = () => {
  if (editingProduct.value) {
    // 更新現有商品
    const index = products.value.findIndex(
      (p) => p.id === editingProduct.value.id
    );
    if (index > -1) {
      products.value[index] = {
        ...formData.value,
        id: editingProduct.value.id,
        sold: editingProduct.value.sold,
      };
    }
  } else {
    // 新增商品
    const newProduct = {
      ...formData.value,
      id: products.value.length + 1,
      sold: 0,
    };
    products.value.push(newProduct);
  }
  closeModal();
};

// 切換商品狀態
const toggleProductStatus = (product) => {
  const index = products.value.findIndex((p) => p.id === product.id);
  if (index > -1) {
    products.value[index].status =
      product.status === "active" ? "inactive" : "active";
  }
};

// 刪除商品
const deleteProduct = (product) => {
  if (confirm(`確定要刪除商品「${product.name}」嗎?`)) {
    const index = products.value.findIndex((p) => p.id === product.id);
    if (index > -1) {
      products.value.splice(index, 1);
    }
  }
};
</script>
