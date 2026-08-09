<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">
        加入會員
      </h1>
      <p class="text-sm text-gray-500 text-center mb-6">
        註冊即享 $100 購物金與生日優惠
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.name"
          label="姓名"
          placeholder="請輸入姓名"
          required
          :error="errors.name"
        />
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
          placeholder="至少 6 個字元"
          required
          :error="errors.password"
        />
        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="確認密碼"
          placeholder="請再輸入一次密碼"
          required
          :error="errors.confirmPassword"
        />

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

        <BaseButton type="submit" variant="primary" block :loading="submitting">
          註冊
        </BaseButton>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        已經有帳號了？
        <router-link
          to="/user/login"
          class="text-amber-800 font-medium hover:underline"
        >
          前往登入
        </router-link>
      </p>

      <p class="text-xs text-gray-400 text-center mt-4">
        本專案未串接真實後端，註冊功能僅示範表單驗證流程，不會建立真正的帳號。
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const formError = ref("");
const submitting = ref(false);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = () => {
  errors.name = form.name.trim() ? "" : "請輸入姓名";
  errors.email = EMAIL_REGEX.test(form.email) ? "" : "請輸入有效的 Email";
  errors.password = form.password.length >= 6 ? "" : "密碼至少需要 6 個字元";
  errors.confirmPassword =
    form.confirmPassword === form.password ? "" : "兩次密碼輸入不一致";

  return (
    !errors.name && !errors.email && !errors.password && !errors.confirmPassword
  );
};

const handleSubmit = async () => {
  formError.value = "";
  if (!validate()) return;

  submitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 400));
  submitting.value = false;

  // 本專案未串接後端，這裡僅示範註冊成功後導向登入頁的流程
  router.push({
    name: "Login",
    query: { registered: "1" },
  });
};
</script>
