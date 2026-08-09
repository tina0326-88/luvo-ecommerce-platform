<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">地址管理</h1>
        <BaseButton variant="primary" @click="openCreateModal">
          新增地址
        </BaseButton>
      </div>

      <!-- 地址列表 -->
      <div
        v-if="userStore.addresses.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div
          v-for="address in userStore.addresses"
          :key="address.id"
          class="bg-white rounded-xl shadow-md p-6"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <p class="font-medium text-gray-800">{{ address.recipient }}</p>
              <span
                v-if="address.isDefault"
                class="text-xs px-2 py-0.5 bg-amber-800 text-white rounded-full"
              >
                預設地址
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-1">{{ address.phone }}</p>
          <p class="text-sm text-gray-600 mb-4">
            {{ address.city }}{{ address.district }}{{ address.detail }}
          </p>

          <div class="flex gap-2">
            <BaseButton
              v-if="!address.isDefault"
              variant="text"
              size="sm"
              @click="userStore.setDefaultAddress(address.id)"
            >
              設為預設
            </BaseButton>
            <BaseButton
              variant="text"
              size="sm"
              @click="openEditModal(address)"
            >
              編輯
            </BaseButton>
            <BaseButton
              variant="text"
              size="sm"
              @click="openDeleteModal(address)"
            >
              刪除
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-24">
        <p class="text-gray-500 text-lg mb-6">還沒有新增任何收件地址</p>
        <BaseButton variant="primary" @click="openCreateModal"
          >新增地址</BaseButton
        >
      </div>
    </div>

    <!-- 新增／編輯地址 Modal -->
    <BaseModal
      v-model="showFormModal"
      :title="editingId ? '編輯地址' : '新增地址'"
      @confirm="handleSubmit"
    >
      <div class="space-y-4">
        <BaseInput
          v-model="form.recipient"
          label="收件人姓名"
          required
          :error="errors.recipient"
        />
        <BaseInput
          v-model="form.phone"
          label="聯絡電話"
          required
          :error="errors.phone"
        />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >縣市</label
            >
            <select
              v-model="form.city"
              @change="form.district = ''"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">請選擇縣市</option>
              <option v-for="city in cityOptions" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
            <p v-if="errors.city" class="mt-1 text-sm text-red-600">
              {{ errors.city }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >行政區</label
            >
            <select
              v-model="form.district"
              :disabled="!form.city"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            >
              <option value="">請選擇行政區</option>
              <option
                v-for="district in districtOptions"
                :key="district"
                :value="district"
              >
                {{ district }}
              </option>
            </select>
            <p v-if="errors.district" class="mt-1 text-sm text-red-600">
              {{ errors.district }}
            </p>
          </div>
        </div>

        <BaseInput
          v-model="form.detail"
          label="詳細地址"
          placeholder="街道、門牌號碼、樓層"
          required
          :error="errors.detail"
        />
      </div>
    </BaseModal>

    <!-- 刪除確認 Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="刪除地址"
      size="sm"
      @confirm="confirmDelete"
    >
      <p class="text-gray-600">
        確定要刪除「{{ pendingDeleteAddress?.recipient }}」的收件地址嗎？
      </p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import { useUserStore } from "@/stores/useUserStore";
import { CITY_DISTRICTS } from "@/utils/constants";

const userStore = useUserStore();

const cityOptions = Object.keys(CITY_DISTRICTS);
const districtOptions = computed(() => CITY_DISTRICTS[form.city] || []);

const emptyForm = () => ({
  recipient: "",
  phone: "",
  city: "",
  district: "",
  detail: "",
});

const form = reactive(emptyForm());
const errors = reactive({
  recipient: "",
  phone: "",
  city: "",
  district: "",
  detail: "",
});

const showFormModal = ref(false);
const editingId = ref(null);

const openCreateModal = () => {
  editingId.value = null;
  Object.assign(form, emptyForm());
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  showFormModal.value = true;
};

const openEditModal = (address) => {
  editingId.value = address.id;
  Object.assign(form, {
    recipient: address.recipient,
    phone: address.phone,
    city: address.city,
    district: address.district,
    detail: address.detail,
  });
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  showFormModal.value = true;
};

const validate = () => {
  errors.recipient = form.recipient.trim() ? "" : "請輸入收件人姓名";
  errors.phone = form.phone.trim() ? "" : "請輸入聯絡電話";
  errors.city = form.city ? "" : "請選擇縣市";
  errors.district = form.district ? "" : "請選擇行政區";
  errors.detail = form.detail.trim() ? "" : "請輸入詳細地址";
  return Object.values(errors).every((msg) => !msg);
};

const handleSubmit = () => {
  if (!validate()) return;

  const payload = {
    recipient: form.recipient,
    phone: form.phone,
    city: form.city,
    district: form.district,
    detail: form.detail,
  };

  if (editingId.value) {
    userStore.updateAddress(editingId.value, payload);
  } else {
    userStore.addAddress(payload);
  }

  showFormModal.value = false;
};

// 刪除，不直接在按鈕點擊時就刪除
const showDeleteModal = ref(false);
const pendingDeleteAddress = ref(null);

const openDeleteModal = (address) => {
  pendingDeleteAddress.value = address;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (!pendingDeleteAddress.value) return;
  userStore.deleteAddress(pendingDeleteAddress.value.id);
  pendingDeleteAddress.value = null;
  showDeleteModal.value = false;
};
</script>
