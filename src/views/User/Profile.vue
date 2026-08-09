<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12 max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">個人資料</h1>

      <div class="bg-white rounded-xl shadow-md p-8">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <BaseInput
            :model-value="userStore.currentUser?.email"
            type="email"
            label="Email"
            readonly
            hint="Email 為帳號識別，暫不開放修改"
          />
          <BaseInput
            v-model="form.name"
            label="姓名"
            placeholder="請輸入姓名"
            required
            :error="errors.name"
          />
          <BaseInput
            v-model="form.phone"
            label="手機號碼"
            placeholder="請輸入手機號碼"
            :error="errors.phone"
          />

          <p v-if="successMessage" class="text-sm text-green-600">
            {{ successMessage }}
          </p>

          <BaseButton type="submit" variant="primary" :loading="submitting">
            儲存變更
          </BaseButton>
        </form>
      </div>

      <div
        class="bg-white rounded-xl shadow-md p-6 mt-6 flex items-center justify-between"
      >
        <div>
          <p class="text-sm font-medium text-gray-800">登出帳號</p>
          <p class="text-xs text-gray-500 mt-1">
            登出後需要重新登入才能查看訂單與收藏
          </p>
        </div>
        <BaseButton variant="outline" @click="showLogoutModal = true"
          >登出</BaseButton
        >
      </div>
    </div>

    <BaseModal
      v-model="showLogoutModal"
      title="登出"
      size="sm"
      @confirm="confirmLogout"
    >
      <p class="text-gray-600">確定要登出嗎？</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import { useUserStore } from "@/stores/useUserStore";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  name: userStore.currentUser?.name || "",
  phone: userStore.currentUser?.phone || "",
});

const errors = reactive({ name: "", phone: "" });
const submitting = ref(false);
const successMessage = ref("");

const PHONE_REGEX = /^09\d{2}-?\d{3}-?\d{3}$/;

const validate = () => {
  errors.name = form.name.trim() ? "" : "請輸入姓名";
  errors.phone =
    !form.phone || PHONE_REGEX.test(form.phone) ? "" : "手機號碼格式不正確";
  return !errors.name && !errors.phone;
};

const handleSubmit = async () => {
  successMessage.value = "";
  if (!validate()) return;

  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 400));

  userStore.updateProfile({ name: form.name, phone: form.phone });
  successMessage.value = "個人資料已更新";
  submitting.value = false;
};

const showLogoutModal = ref(false);
const confirmLogout = () => {
  userStore.logout();
  showLogoutModal.value = false;
  router.push({ name: "Login" });
};
</script>
