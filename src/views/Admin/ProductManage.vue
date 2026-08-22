<template>
  <div class="space-y-6">
    <!-- 搜尋與篩選 -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >搜尋商品名稱</label
          >
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="輸入商品名稱"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >分類</label
          >
          <select
            v-model="filterCategory"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">全部分類</option>
            <option
              v-for="(label, key) in productStore.categoryLabels"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select>
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
            <option value="active">上架中</option>
            <option value="inactive">已下架</option>
          </select>
        </div>

        <BaseButton variant="primary" @click="openCreateModal"
          >新增商品</BaseButton
        >
      </div>
    </div>

    <!-- 批量操作列：有勾選商品時才顯示 -->
    <div
      v-if="selectedIds.length > 0"
      class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between"
    >
      <span class="text-sm text-amber-800"
        >已選取 {{ selectedIds.length }} 項商品</span
      >
      <div class="flex gap-2">
        <BaseButton variant="outline" size="sm" @click="bulkSetStatus('active')"
          >批量上架</BaseButton
        >
        <BaseButton
          variant="outline"
          size="sm"
          @click="bulkSetStatus('inactive')"
          >批量下架</BaseButton
        >
        <BaseButton
          variant="danger"
          size="sm"
          @click="showBulkDeleteModal = true"
          >批量刪除</BaseButton
        >
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="text-left text-gray-500 border-b border-gray-200 bg-gray-50"
          >
            <th class="py-3 px-4 w-10">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="accent-amber-800"
              />
            </th>
            <th class="py-3 px-4">商品</th>
            <th class="py-3 px-4">分類</th>
            <th class="py-3 px-4">售價</th>
            <th class="py-3 px-4">庫存</th>
            <th class="py-3 px-4">狀態</th>
            <th class="py-3 px-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in pagedProducts"
            :key="product.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
          >
            <td class="py-3 px-4">
              <input
                type="checkbox"
                :value="product.id"
                v-model="selectedIds"
                class="accent-amber-800"
              />
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-10 h-10 rounded-lg object-cover bg-gray-100"
                />
                <div class="min-w-0">
                  <p class="font-medium text-gray-800 truncate max-w-[220px]">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-gray-400">ID: {{ product.id }}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-gray-600">
              {{ productStore.categoryLabels[product.category] }}
            </td>
            <td class="py-3 px-4 font-medium text-amber-800">
              NT$ {{ formatPrice(product.price) }}
            </td>
            <td class="py-3 px-4">
              <span :class="stockClass(product.stock)">{{
                product.stock
              }}</span>
            </td>
            <td class="py-3 px-4">
              <span
                class="px-2 py-1 text-xs font-bold rounded-full"
                :class="
                  productStore.getStatus(product) === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                "
              >
                {{
                  productStore.getStatus(product) === "active"
                    ? "上架中"
                    : "已下架"
                }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex gap-2 justify-end">
                <button
                  class="text-gray-500 hover:text-amber-800 text-xs font-medium"
                  @click="openEditModal(product)"
                >
                  編輯
                </button>
                <button
                  class="text-gray-500 hover:text-amber-800 text-xs font-medium"
                  @click="
                    productStore.setProductStatus(
                      product.id,
                      productStore.getStatus(product) === 'active'
                        ? 'inactive'
                        : 'active',
                    )
                  "
                >
                  {{
                    productStore.getStatus(product) === "active"
                      ? "下架"
                      : "上架"
                  }}
                </button>
                <button
                  class="text-gray-500 hover:text-red-600 text-xs font-medium"
                  @click="openDeleteModal(product)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="pagedProducts.length === 0">
            <td colspan="7" class="py-12 text-center text-gray-400">
              找不到符合條件的商品
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BasePagination
      v-if="filteredProducts.length > pageSize"
      v-model:current-page="currentPage"
      :total="filteredProducts.length"
      :page-size="pageSize"
    />

    <!-- 新增／編輯商品 Modal -->
    <BaseModal
      v-model="showFormModal"
      :title="editingId ? '編輯商品' : '新增商品'"
      size="lg"
      @confirm="handleSubmit"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.name"
          label="商品名稱"
          required
          :error="errors.name"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >分類</label
          >
          <select
            v-model="form.category"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option
              v-for="(label, key) in productStore.categoryLabels"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select>
          <p v-if="errors.category" class="mt-1 text-sm text-red-600">
            {{ errors.category }}
          </p>
        </div>
        <BaseInput
          v-model.number="form.price"
          type="number"
          label="售價"
          required
          :error="errors.price"
        />
        <BaseInput
          v-model.number="form.originalPrice"
          type="number"
          label="原價（選填）"
        />
        <BaseInput
          v-model.number="form.stock"
          type="number"
          label="庫存數量"
          required
          :error="errors.stock"
        />
        <BaseInput v-model="form.color" label="顏色" />
        <BaseInput v-model="form.material" label="材質" />
        <BaseInput
          v-model="form.image"
          label="圖片路徑"
          placeholder="/images/xxx.jpg"
        />
      </div>
      <div class="mt-4">
        <BaseInput
          v-model="form.description"
          label="商品描述（選填）"
          placeholder="簡短描述商品特色"
        />
      </div>
    </BaseModal>

    <!-- 單筆刪除確認 -->
    <BaseModal
      v-model="showDeleteModal"
      title="刪除商品"
      size="sm"
      @confirm="confirmDelete"
    >
      <p class="text-gray-600">
        確定要刪除「{{ pendingDeleteProduct?.name }}」嗎？此操作無法復原。
      </p>
    </BaseModal>

    <!-- 批量刪除確認 -->
    <BaseModal
      v-model="showBulkDeleteModal"
      title="批量刪除商品"
      size="sm"
      @confirm="confirmBulkDelete"
    >
      <p class="text-gray-600">
        確定要刪除選取的 {{ selectedIds.length }} 項商品嗎？此操作無法復原。
      </p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import BasePagination from "@/components/base/BasePagination.vue";
import { useProductStore } from "@/stores/useProductStore";
import { formatPrice } from "@/utils/helpers";

const productStore = useProductStore();

const searchKeyword = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const pageSize = 10;

const filteredProducts = computed(() => {
  let result = productStore.products;

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }
  if (filterCategory.value) {
    result = result.filter((p) => p.category === filterCategory.value);
  }
  if (filterStatus.value) {
    result = result.filter(
      (p) => productStore.getStatus(p) === filterStatus.value,
    );
  }

  return result;
});

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});

const stockClass = (stock) => {
  if (stock === 0) return "text-red-600 font-bold";
  if (stock < 5) return "text-orange-500 font-medium";
  return "text-gray-700";
};

// ---------- 勾選與批量操作 ----------
const selectedIds = ref([]);

const allSelected = computed(() => {
  return (
    pagedProducts.value.length > 0 &&
    pagedProducts.value.every((p) => selectedIds.value.includes(p.id))
  );
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter(
      (id) => !pagedProducts.value.some((p) => p.id === id),
    );
  } else {
    const pageIds = pagedProducts.value.map((p) => p.id);
    selectedIds.value = [...new Set([...selectedIds.value, ...pageIds])];
  }
};

const bulkSetStatus = (status) => {
  productStore.setProductsStatus(selectedIds.value, status);
  selectedIds.value = [];
};

const showBulkDeleteModal = ref(false);
const confirmBulkDelete = () => {
  productStore.deleteProducts(selectedIds.value);
  selectedIds.value = [];
  showBulkDeleteModal.value = false;
};

// ---------- 新增／編輯 ----------
const emptyForm = () => ({
  name: "",
  category: "leather-shoes",
  price: 0,
  originalPrice: null,
  stock: 0,
  color: "",
  material: "",
  image: "",
  description: "",
});

const form = reactive(emptyForm());
const errors = reactive({ name: "", category: "", price: "", stock: "" });
const showFormModal = ref(false);
const editingId = ref(null);

const openCreateModal = () => {
  editingId.value = null;
  Object.assign(form, emptyForm());
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  showFormModal.value = true;
};

const openEditModal = (product) => {
  editingId.value = product.id;
  Object.assign(form, {
    name: product.name,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    color: product.color || "",
    material: product.material || "",
    image: product.image || "",
    description: product.description || "",
  });
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  showFormModal.value = true;
};

const validate = () => {
  errors.name = form.name.trim() ? "" : "請輸入商品名稱";
  errors.category = form.category ? "" : "請選擇分類";
  errors.price = form.price > 0 ? "" : "售價必須大於 0";
  errors.stock = form.stock >= 0 ? "" : "庫存不可為負數";
  return Object.values(errors).every((msg) => !msg);
};

const handleSubmit = () => {
  if (!validate()) return;

  if (editingId.value) {
    productStore.updateProduct(editingId.value, { ...form });
  } else {
    productStore.createProduct({ ...form });
  }

  showFormModal.value = false;
};

// ---------- 單筆刪除 ----------
const showDeleteModal = ref(false);
const pendingDeleteProduct = ref(null);

const openDeleteModal = (product) => {
  pendingDeleteProduct.value = product;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (!pendingDeleteProduct.value) return;
  productStore.deleteProduct(pendingDeleteProduct.value.id);
  pendingDeleteProduct.value = null;
  showDeleteModal.value = false;
};
</script>
