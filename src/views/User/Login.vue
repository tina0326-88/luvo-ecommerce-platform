<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Logo 區域 -->
        <div class="text-center mb-8">
          <router-link to="/" class="inline-block">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Luvo</h1>
          </router-link>
          <p class="text-gray-600">歡迎回來</p>
        </div>
  
        <!-- 登入表單卡片 -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            會員登入
          </h2>
  
          <!-- 錯誤訊息 -->
          <div
            v-if="errorMessage"
            class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {{ errorMessage }}
          </div>
  
          <!-- 成功訊息 -->
          <div
            v-if="successMessage"
            class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
          >
            {{ successMessage }}
          </div>
  
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email 輸入框 -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                電子信箱
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="請輸入電子信箱"
                required
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                  errors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500'
                ]"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
  
            <!-- 密碼輸入框 -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="請輸入密碼"
                  required
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                    errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-amber-500'
                  ]"
                />
                <!-- 顯示/隱藏密碼按鈕 -->
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
  
            <!-- 記住我 & 忘記密碼 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember"
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-bk-800 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label for="remember" class="ml-2 block text-sm text-gray-700">
                  記住我
                </label>
              </div>
  
              <router-link
                to="/forgot-password"
                class="text-sm text-bk-800 hover:text-bk-900"
              >
                忘記密碼？
              </router-link>
            </div>
  
            <!-- 登入按鈕 -->
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
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? '登入中...' : '登入' }}
            </button>
          </form>
  
          <!-- 分隔線 -->
          <div class="mt-6 relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>
  
          <!-- 第三方登入 -->
          <div class="mt-6 space-y-3">
            <button
              type="button"
              @click="handleGoogleLogin"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 登入
            </button>
  
            <button
              type="button"
              @click="handleFacebookLogin"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166FE5] transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              使用 Facebook 登入
            </button>
          </div>
  
          <!-- 註冊連結 -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              還不是會員？
              <router-link
                to="/register"
                class="font-medium text-amber-800 hover:text-amber-900"
              >
                立即註冊
              </router-link>
            </p>
          </div>
        </div>
  
        <!-- 訪客瀏覽 -->
        <div class="mt-4 text-center">
          <router-link
            to="/"
            class="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首頁
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/useUserStore'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  // 表單資料
  const form = reactive({
    email: '',
    password: '',
    remember: false
  })
  
  // 錯誤訊息
  const errors = reactive({
    email: '',
    password: ''
  })
  
  const errorMessage = ref('')
  const successMessage = ref('')
  const loading = ref(false)
  const showPassword = ref(false)
  
  // 表單驗證
  const validateForm = () => {
    let isValid = true
    
    // 清空錯誤訊息
    errors.email = ''
    errors.password = ''
    errorMessage.value = ''
  
    // Email 驗證
    if (!form.email) {
      errors.email = '請輸入電子信箱'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = '電子信箱格式不正確'
      isValid = false
    }
  
    // 密碼驗證
    if (!form.password) {
      errors.password = '請輸入密碼'
      isValid = false
    } else if (form.password.length < 6) {
      errors.password = '密碼至少需要 6 個字元'
      isValid = false
    }
  
    return isValid
  }
  
  // 處理登入
  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }
  
    loading.value = true
    errorMessage.value = ''
  
    try {
      // TODO: 實際的登入 API 呼叫
      // await userStore.login(form.email, form.password)
      
      // 模擬 API 請求
      await new Promise(resolve => setTimeout(resolve, 1500))
  
      // 模擬登入驗證
      if (form.email === 'demo@luvo.com' && form.password === '123456') {
        successMessage.value = '登入成功！即將跳轉...'
        
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        errorMessage.value = '帳號或密碼錯誤，請重新輸入'
      }
  
    } catch (error) {
      errorMessage.value = error.message || '登入失敗，請稍後再試'
    } finally {
      loading.value = false
    }
  }
  
  // Google 登入
  const handleGoogleLogin = () => {
    alert('Google 登入功能開發中...')
    // TODO: 實作 Google OAuth
  }
  
  // Facebook 登入
  const handleFacebookLogin = () => {
    alert('Facebook 登入功能開發中...')
    // TODO: 實作 Facebook OAuth
  }
  </script>
  
  <style scoped>
  /* 自訂樣式 */
  </style>