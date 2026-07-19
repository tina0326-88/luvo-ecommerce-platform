<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <!-- Logo 區域 -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Luvo</h1>
        </router-link>
        <p class="text-gray-600">重設密碼</p>
      </div>

      <!-- 重設密碼表單卡片 -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- 步驟 1: 輸入 Email -->
        <div v-if="step === 1">
          <div class="text-center mb-6">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4"
            >
              <svg
                class="w-8 h-8 text-amber-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">忘記密碼</h2>
            <p class="text-sm text-gray-600">
              請輸入您的註冊信箱，我們將發送重設密碼連結給您
            </p>
          </div>

          <!-- 錯誤訊息 -->
          <div
            v-if="errorMessage"
            class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSendEmail" class="space-y-6">
            <!-- Email 輸入框 -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                電子信箱
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="請輸入註冊時使用的信箱"
                required
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                  emailError
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500',
                ]"
              />
              <p v-if="emailError" class="mt-1 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>

            <!-- 發送按鈕 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? "發送中..." : "發送重設連結" }}
            </button>
          </form>

          <!-- 返回登入 -->
          <div class="mt-6 text-center">
            <router-link
              to="/login"
              class="text-sm text-amber-800 hover:text-amber-900 inline-flex items-center"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回登入
            </router-link>
          </div>
        </div>

        <!-- 步驟 2: 確認訊息 -->
        <div v-else-if="step === 2" class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">郵件已發送</h2>
          <p class="text-gray-600 mb-6">
            我們已將重設密碼的連結發送至<br />
            <span class="font-medium text-gray-900">{{ email }}</span>
          </p>

          <div
            class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left"
          >
            <h3 class="font-medium text-blue-900 mb-2">接下來該做什麼？</h3>
            <ol
              class="text-sm text-blue-800 space-y-1 list-decimal list-inside"
            >
              <li>檢查您的電子信箱</li>
              <li>點擊郵件中的重設密碼連結</li>
              <li>設定新密碼</li>
              <li>使用新密碼登入</li>
            </ol>
          </div>

          <div class="space-y-3">
            <button
              @click="handleResendEmail"
              :disabled="resendCountdown > 0"
              class="w-full px-6 py-3 border border-amber-800 text-amber-800 font-medium rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                resendCountdown > 0
                  ? `${resendCountdown} 秒後可重新發送`
                  : "重新發送郵件"
              }}
            </button>

            <router-link
              to="/login"
              class="block w-full px-6 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-colors text-center"
            >
              返回登入
            </router-link>
          </div>

          <!-- 提示訊息 -->
          <div class="mt-6 text-xs text-gray-500">
            <p>沒收到郵件？</p>
            <p class="mt-1">請檢查垃圾郵件資料夾，或稍後再試</p>
          </div>
        </div>

        <!-- 步驟 3: 重設密碼（從郵件連結進入） -->
        <div v-else-if="step === 3">
          <div class="text-center mb-6">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4"
            >
              <svg
                class="w-8 h-8 text-amber-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">設定新密碼</h2>
            <p class="text-sm text-gray-600">請輸入您的新密碼</p>
          </div>

          <!-- 錯誤訊息 -->
          <div
            v-if="errorMessage"
            class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <!-- 新密碼 -->
            <div>
              <label
                for="newPassword"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                新密碼
              </label>
              <div class="relative">
                <input
                  id="newPassword"
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="至少 6 個字元"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    v-if="!showNewPassword"
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 確認新密碼 -->
            <div>
              <label
                for="confirmNewPassword"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                確認新密碼
              </label>
              <div class="relative">
                <input
                  id="confirmNewPassword"
                  v-model="confirmNewPassword"
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  placeholder="請再次輸入新密碼"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
                <button
                  type="button"
                  @click="showConfirmNewPassword = !showConfirmNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    v-if="!showConfirmNewPassword"
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 確認按鈕 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? "更新中..." : "確認重設密碼" }}
            </button>
          </form>
        </div>
      </div>

      <!-- 返回首頁 -->
      <div class="mt-4 text-center">
        <router-link
          to="/"
          class="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
        >
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回首頁
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 當前步驟 (1: 輸入email, 2: 確認訊息, 3: 重設密碼)
const step = ref(1);

// 表單資料
const email = ref("");
const emailError = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");

const errorMessage = ref("");
const loading = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

// 重新發送倒數計時
const resendCountdown = ref(0);

// 檢查是否有 token (從郵件連結進入)
onMounted(() => {
  const token = route.query.token;
  if (token) {
    step.value = 3;
  }
});

// Email 驗證
const validateEmail = () => {
  emailError.value = "";
  errorMessage.value = "";

  if (!email.value) {
    emailError.value = "請輸入電子信箱";
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "電子信箱格式不正確";
    return false;
  }

  return true;
};

// 發送重設密碼郵件
const handleSendEmail = async () => {
  if (!validateEmail()) {
    return;
  }

  loading.value = true;

  try {
    // TODO: 實際的 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模擬成功
    step.value = 2;
    startResendCountdown();
  } catch (error) {
    errorMessage.value = "發送失敗，請稍後再試";
  } finally {
    loading.value = false;
  }
};

// 重新發送郵件
const handleResendEmail = async () => {
  loading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("重設連結已重新發送至您的信箱");
    startResendCountdown();
  } catch (error) {
    alert("發送失敗，請稍後再試");
  } finally {
    loading.value = false;
  }
};

// 開始倒數計時
const startResendCountdown = () => {
  resendCountdown.value = 60;
  const timer = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 重設密碼
const handleResetPassword = async () => {
  errorMessage.value = "";

  // 驗證
  if (!newPassword.value) {
    errorMessage.value = "請輸入新密碼";
    return;
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = "密碼至少需要 6 個字元";
    return;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = "兩次輸入的密碼不一致";
    return;
  }

  loading.value = true;

  try {
    // TODO: 實際的 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模擬成功
    alert("密碼重設成功！");
    router.push("/login");
  } catch (error) {
    errorMessage.value = "重設失敗，請重新嘗試";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 自訂樣式 */
</style>
