import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { loadFromStorage, saveToStorage } from "@/utils/helpers";

const USER_STORAGE_KEY = "luvo-user";
const FAVORITES_STORAGE_KEY = "luvo-favorites";

const MOCK_ACCOUNTS = [
  {
    email: "demo@luvo.com",
    password: "123456",
    name: "Luvo 管理員",
    isAdmin: true,
  },
  {
    email: "user@luvo.com",
    password: "user123",
    name: "Luvo 會員",
    isAdmin: false,
  },
];

export const useUserStore = defineStore("user", () => {
  const currentUser = ref(loadFromStorage(USER_STORAGE_KEY, null));
  const favorites = ref(loadFromStorage(FAVORITES_STORAGE_KEY, []));

  const isLoggedIn = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.isAdmin === true);

  // 模擬登入：比對展示帳號，成功則寫入 localStorage 維持登入狀態
  const login = ({ email, password }) => {
    const matched = MOCK_ACCOUNTS.find(
      (account) => account.email === email && account.password === password,
    );

    if (!matched) {
      return { success: false, message: "帳號或密碼錯誤" };
    }

    currentUser.value = {
      email: matched.email,
      name: matched.name,
      isAdmin: matched.isAdmin,
    };
    saveToStorage(USER_STORAGE_KEY, currentUser.value);

    return { success: true };
  };

  const logout = () => {
    currentUser.value = null;
    saveToStorage(USER_STORAGE_KEY, null);
  };

  // 收藏清單：跟商品 id 對應，不分商品分類，讓皮鞋/靴子/休閒鞋頁共用同一份清單
  const isFavorited = (productId) => {
    return favorites.value.includes(productId);
  };

  const toggleFavorite = (productId) => {
    const index = favorites.value.indexOf(productId);
    if (index > -1) {
      favorites.value.splice(index, 1);
    } else {
      favorites.value.push(productId);
    }
    saveToStorage(FAVORITES_STORAGE_KEY, favorites.value);
  };

  return {
    currentUser,
    favorites,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    isFavorited,
    toggleFavorite,
  };
});
