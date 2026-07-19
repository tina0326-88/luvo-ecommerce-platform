<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 麵包屑導航 -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex text-sm text-gray-600">
          <router-link to="/" class="hover:text-amber-800">首頁</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-900">個人資料</span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左側選單 -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <!-- 用戶頭像與名稱 -->
            <div class="text-center mb-6">
              <div class="relative inline-block">
                <div
                  class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <span class="text-3xl font-bold text-amber-800">
                    {{ userInitial }}
                  </span>
                </div>
                <button
                  @click="showAvatarUpload = true"
                  class="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                  title="更換頭像"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
              <h3 class="font-bold text-gray-900">{{ userProfile.name }}</h3>
              <p class="text-sm text-gray-600">{{ userProfile.email }}</p>
            </div>

            <!-- 會員資訊 -->
            <div class="border-t pt-4 mb-4 space-y-2">
              <div class="flex items-center text-sm">
                <span class="text-gray-600">會員等級：</span>
                <span
                  class="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded"
                >
                  黃金會員
                </span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <span>購物金：</span>
                <span class="ml-2 font-bold text-amber-800">NT$ 500</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <span>紅利點數：</span>
                <span class="ml-2 font-bold text-amber-800">1,250</span>
              </div>
            </div>

            <!-- 選單 -->
            <nav class="space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  activeTab === tab.id
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-gray-700 hover:bg-gray-50',
                ]"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="tab.icon"
                  />
                </svg>
                {{ tab.name }}
              </button>
            </nav>

            <!-- 登出按鈕 -->
            <button
              @click="handleLogout"
              class="w-full mt-4 flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              登出
            </button>
          </div>
        </aside>

        <!-- 右側內容 -->
        <main class="lg:col-span-3">
          <!-- 基本資料 -->
          <div
            v-show="activeTab === 'profile'"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-6">基本資料</h2>

            <!-- 成功訊息 -->
            <div
              v-if="successMessage"
              class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
            >
              {{ successMessage }}
            </div>

            <form @submit.prevent="handleUpdateProfile" class="space-y-6">
              <!-- 姓名 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  姓名 <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="editProfile.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  電子信箱
                </label>
                <input
                  v-model="editProfile.email"
                  type="email"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p class="mt-1 text-xs text-gray-500">電子信箱無法修改</p>
              </div>

              <!-- 手機號碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  手機號碼 <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="editProfile.phone"
                  type="tel"
                  required
                  maxlength="10"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- 生日 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  生日
                </label>
                <input
                  v-model="editProfile.birthday"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- 性別 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  性別
                </label>
                <div class="flex gap-4">
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="editProfile.gender"
                      type="radio"
                      value="male"
                      class="mr-2 text-amber-800 focus:ring-amber-500"
                    />
                    <span>男性</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="editProfile.gender"
                      type="radio"
                      value="female"
                      class="mr-2 text-amber-800 focus:ring-amber-500"
                    />
                    <span>女性</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="editProfile.gender"
                      type="radio"
                      value="other"
                      class="mr-2 text-amber-800 focus:ring-amber-500"
                    />
                    <span>其他</span>
                  </label>
                </div>
              </div>

              <!-- 儲存按鈕 -->
              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-6 py-2 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-50"
                >
                  {{ loading ? "儲存中..." : "儲存變更" }}
                </button>
                <button
                  type="button"
                  @click="resetForm"
                  class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>

          <!-- 修改密碼 -->
          <div
            v-show="activeTab === 'password'"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-6">修改密碼</h2>

            <!-- 錯誤訊息 -->
            <div
              v-if="passwordError"
              class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {{ passwordError }}
            </div>

            <!-- 成功訊息 -->
            <div
              v-if="passwordSuccess"
              class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
            >
              {{ passwordSuccess }}
            </div>

            <form
              @submit.prevent="handleChangePassword"
              class="space-y-6 max-w-md"
            >
              <!-- 目前密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  目前密碼 <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- 新密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  新密碼 <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p class="mt-1 text-xs text-gray-500">密碼至少需要 6 個字元</p>
              </div>

              <!-- 確認新密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  確認新密碼 <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- 按鈕 -->
              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-6 py-2 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-50"
                >
                  {{ loading ? "更新中..." : "更新密碼" }}
                </button>
                <button
                  type="button"
                  @click="resetPasswordForm"
                  class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>

          <!-- 收件地址 -->
          <div
            v-show="activeTab === 'address'"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">收件地址</h2>
              <button
                @click="showAddressModal = true"
                class="px-4 py-2 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors"
              >
                + 新增地址
              </button>
            </div>

            <!-- 地址列表 -->
            <div class="space-y-4">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-medium text-gray-900">{{
                        address.name
                      }}</span>
                      <span class="text-gray-600">{{ address.phone }}</span>
                      <span
                        v-if="address.isDefault"
                        class="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded"
                      >
                        預設
                      </span>
                    </div>
                    <p class="text-gray-600 text-sm">
                      {{ address.fullAddress }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="editAddress(address)"
                      class="text-amber-800 hover:text-amber-900"
                    >
                      編輯
                    </button>
                    <button
                      @click="deleteAddress(address.id)"
                      class="text-red-600 hover:text-red-700"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-if="addresses.length === 0"
                class="text-center py-8 text-gray-500"
              >
                尚無收件地址，請新增地址
              </div>
            </div>
          </div>

          <!-- 通知設定 -->
          <div
            v-show="activeTab === 'notifications'"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-6">通知設定</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 class="font-medium text-gray-900">訂單通知</h3>
                  <p class="text-sm text-gray-600">接收訂單狀態更新通知</p>
                </div>
                <label class="relative inline-block w-12 h-6">
                  <input
                    v-model="notifications.order"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"
                  ></div>
                </label>
              </div>

              <div class="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 class="font-medium text-gray-900">促銷活動</h3>
                  <p class="text-sm text-gray-600">接收最新優惠與活動資訊</p>
                </div>
                <label class="relative inline-block w-12 h-6">
                  <input
                    v-model="notifications.promotion"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"
                  ></div>
                </label>
              </div>

              <div class="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 class="font-medium text-gray-900">新品上市</h3>
                  <p class="text-sm text-gray-600">第一時間獲得新品資訊</p>
                </div>
                <label class="relative inline-block w-12 h-6">
                  <input
                    v-model="notifications.newProduct"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"
                  ></div>
                </label>
              </div>

              <div class="flex items-center justify-between py-3">
                <div>
                  <h3 class="font-medium text-gray-900">電子報</h3>
                  <p class="text-sm text-gray-600">訂閱每週電子報</p>
                </div>
                <label class="relative inline-block w-12 h-6">
                  <input
                    v-model="notifications.newsletter"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"
                  ></div>
                </label>
              </div>
            </div>

            <button
              @click="saveNotifications"
              class="mt-6 px-6 py-2 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors"
            >
              儲存設定
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 當前分頁
const activeTab = ref("profile");

// 分頁選單
const tabs = ref([
  {
    id: "profile",
    name: "基本資料",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    id: "password",
    name: "修改密碼",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    id: "address",
    name: "收件地址",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    id: "notifications",
    name: "通知設定",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  },
]);

// 用戶資料
const userProfile = reactive({
  name: "王小明",
  email: "demo@luvo.com",
  phone: "0912345678",
  birthday: "1990-01-01",
  gender: "male",
});

// 編輯資料
const editProfile = reactive({ ...userProfile });

// 用戶名首字
const userInitial = computed(() => {
  return userProfile.name.charAt(0).toUpperCase();
});

// 修改密碼表單
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 地址列表
const addresses = ref([
  {
    id: 1,
    name: "王小明",
    phone: "0912345678",
    fullAddress: "106 台北市大安區忠孝東路四段 123 號 5 樓",
    isDefault: true,
  },
]);

// 通知設定
const notifications = reactive({
  order: true,
  promotion: true,
  newProduct: false,
  newsletter: false,
});

// 狀態
const loading = ref(false);
const successMessage = ref("");
const passwordError = ref("");
const passwordSuccess = ref("");
const showAvatarUpload = ref(false);
const showAddressModal = ref(false);

// 更新個人資料
const handleUpdateProfile = async () => {
  loading.value = true;
  successMessage.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    Object.assign(userProfile, editProfile);
    successMessage.value = "✓ 資料更新成功！";

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    alert("更新失敗，請稍後再試");
  } finally {
    loading.value = false;
  }
};

// 重設表單
const resetForm = () => {
  Object.assign(editProfile, userProfile);
};

// 修改密碼
const handleChangePassword = async () => {
  passwordError.value = "";
  passwordSuccess.value = "";

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = "新密碼至少需要 6 個字元";
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "兩次輸入的密碼不一致";
    return;
  }

  loading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    passwordSuccess.value = "✓ 密碼更新成功！";
    resetPasswordForm();

    setTimeout(() => {
      passwordSuccess.value = "";
    }, 3000);
  } catch (error) {
    passwordError.value = "密碼更新失敗，請檢查目前密碼是否正確";
  } finally {
    loading.value = false;
  }
};

// 重設密碼表單
const resetPasswordForm = () => {
  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
};

// 編輯地址
const editAddress = (address) => {
  alert(`編輯地址：${address.fullAddress}`);
  // TODO: 開啟編輯地址 Modal
};

// 刪除地址
const deleteAddress = (id) => {
  if (confirm("確定要刪除此地址嗎？")) {
    const index = addresses.value.findIndex((a) => a.id === id);
    if (index > -1) {
      addresses.value.splice(index, 1);
    }
  }
};

// 儲存通知設定
const saveNotifications = () => {
  alert("✓ 通知設定已儲存");
};

// 登出
const handleLogout = () => {
  if (confirm("確定要登出嗎？")) {
    // TODO: 清除登入狀態
    router.push("/login");
  }
};
</script>

<style scoped>
/* 自訂樣式 */
</style>
