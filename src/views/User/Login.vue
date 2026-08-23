<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">會員登入</h1>
      <p class="text-sm text-gray-500 text-center mb-6">
        歡迎回來，登入以繼續購物
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          :error="errors.email"
        />
        <BaseInput
          v-model="form.password"
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          required
          :error="errors.password"
        />

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <BaseButton
          type="submit"
          variant="primary"
          block
          :loading="submitting"
        >
          登入
        </BaseButton>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        還沒有帳號？
        <router-link to="/user/register" class="text-amber-800 font-medium hover:underline">
          立即註冊
        </router-link>
      </p>

      <!-- 測試帳號提示：純前端展示專案，方便評審快速登入體驗 -->
      <div class="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400 space-y-1">
        <p>測試帳號（僅供展示，非真實驗證）：</p>
        <p>管理員：demo@luvo.com / 123456</p>
        <p>一般會員：user@luvo.com / user123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { useUserStore } from "@/stores/useUserStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const formError = ref("");
const submitting = ref(false);

const validate = () => {
  errors.email = form.email ? "" : "請輸入 Email";
  errors.password = form.password ? "" : "請輸入密碼";
  return !errors.email && !errors.password;
};

const handleSubmit = async () => {
  formError.value = "";
  if (!validate()) return;

  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 400));

  const result = userStore.login({
    email: form.email,
    password: form.password,
  });

  submitting.value = false;

  if (!result.success) {
    formError.value = result.message;
    return;
  }

  // 登入成功後依身分分流：
  // - 有 redirect 參數（guards.js 導來的）優先導回原本要去的頁面
  // - 沒有 redirect 時，管理員導去後台儀表板，一般會員導回首頁
  const redirectTo =
    route.query.redirect ||
    (userStore.isAdmin ? "/admin/dashboard" : "/");

  router.push(redirectTo);
};
</script>