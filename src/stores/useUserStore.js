import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { loadFromStorage, saveToStorage } from "@/utils/helpers";

const USER_STORAGE_KEY = "luvo-user";
const FAVORITES_STORAGE_KEY = "luvo-favorites";
const ADDRESSES_STORAGE_KEY = "luvo-addresses";
const COUPONS_STORAGE_KEY = "luvo-coupons";

const MOCK_ACCOUNTS = [
  {
    email: "demo@luvo.com",
    password: "123456",
    name: "Luvo 管理員",
    phone: "0912-345-678",
    isAdmin: true,
  },
  {
    email: "user@luvo.com",
    password: "user123",
    name: "Luvo 會員",
    phone: "0987-654-321",
    isAdmin: false,
  },
];

// 新會員展示用的預設優惠券，呼應 Home.vue「新會員三重好禮」的活動內容
const DEFAULT_COUPONS = [
  {
    id: 1,
    title: "新會員 $100 購物金",
    type: "cash",
    discountValue: 100,
    minSpend: 0,
    expiredAt: "2026-12-31",
    used: false,
  },
  {
    id: 2,
    title: "全館滿 $3,000 免運券",
    type: "shipping",
    discountValue: 0,
    minSpend: 3000,
    expiredAt: "2026-10-31",
    used: false,
  },
  {
    id: 3,
    title: "生日當月 85 折券",
    type: "percent",
    discountValue: 15,
    minSpend: 1000,
    expiredAt: "2026-08-31",
    used: false,
  },
  {
    id: 4,
    title: "母親節限定折扣券",
    type: "cash",
    discountValue: 200,
    minSpend: 2000,
    expiredAt: "2026-05-15",
    used: true,
  },
];

export const useUserStore = defineStore("user", () => {
  const currentUser = ref(loadFromStorage(USER_STORAGE_KEY, null));
  const favorites = ref(loadFromStorage(FAVORITES_STORAGE_KEY, []));
  const addresses = ref(loadFromStorage(ADDRESSES_STORAGE_KEY, []));
  const coupons = ref(loadFromStorage(COUPONS_STORAGE_KEY, DEFAULT_COUPONS));

  const isLoggedIn = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.isAdmin === true);

  // ---------- 登入 / 登出 ----------
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
      phone: matched.phone,
      isAdmin: matched.isAdmin,
    };
    saveToStorage(USER_STORAGE_KEY, currentUser.value);

    return { success: true };
  };

  const logout = () => {
    currentUser.value = null;
    saveToStorage(USER_STORAGE_KEY, null);
  };

  // ---------- 個人資料 ----------
  const updateProfile = ({ name, phone }) => {
    if (!currentUser.value) return;
    currentUser.value = { ...currentUser.value, name, phone };
    saveToStorage(USER_STORAGE_KEY, currentUser.value);
  };

  // ---------- 收藏清單 ----------
  const isFavorited = (productId) => favorites.value.includes(productId);

  const toggleFavorite = (productId) => {
    const index = favorites.value.indexOf(productId);
    if (index > -1) {
      favorites.value.splice(index, 1);
    } else {
      favorites.value.push(productId);
    }
    saveToStorage(FAVORITES_STORAGE_KEY, favorites.value);
  };

  // ---------- 地址管理 ----------
  const addAddress = (address) => {
    const newAddress = {
      id: Math.max(0, ...addresses.value.map((a) => a.id)) + 1,
      isDefault: addresses.value.length === 0, // 第一筆自動設為預設地址
      ...address,
    };

    if (newAddress.isDefault) {
      addresses.value.forEach((a) => (a.isDefault = false));
    }

    addresses.value.push(newAddress);
    saveToStorage(ADDRESSES_STORAGE_KEY, addresses.value);
  };

  const updateAddress = (id, updates) => {
    const target = addresses.value.find((a) => a.id === id);
    if (!target) return;
    Object.assign(target, updates);
    saveToStorage(ADDRESSES_STORAGE_KEY, addresses.value);
  };

  const deleteAddress = (id) => {
    const wasDefault = addresses.value.find((a) => a.id === id)?.isDefault;
    addresses.value = addresses.value.filter((a) => a.id !== id);

    // 刪除的剛好是預設地址時，自動把第一筆設為新的預設地址，避免沒有任何預設地址
    if (wasDefault && addresses.value.length > 0) {
      addresses.value[0].isDefault = true;
    }

    saveToStorage(ADDRESSES_STORAGE_KEY, addresses.value);
  };

  const setDefaultAddress = (id) => {
    addresses.value.forEach((a) => {
      a.isDefault = a.id === id;
    });
    saveToStorage(ADDRESSES_STORAGE_KEY, addresses.value);
  };

  // ---------- 優惠券 ----------
  const availableCoupons = computed(() => {
    const today = new Date();
    return coupons.value.filter(
      (c) => !c.used && new Date(c.expiredAt) >= today,
    );
  });

  const usedCoupons = computed(() => coupons.value.filter((c) => c.used));

  const expiredCoupons = computed(() => {
    const today = new Date();
    return coupons.value.filter(
      (c) => !c.used && new Date(c.expiredAt) < today,
    );
  });

  const useCoupon = (id) => {
    const target = coupons.value.find((c) => c.id === id);
    if (!target) return;
    target.used = true;
    saveToStorage(COUPONS_STORAGE_KEY, coupons.value);
  };

  return {
    currentUser,
    favorites,
    addresses,
    coupons,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    updateProfile,
    isFavorited,
    toggleFavorite,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    availableCoupons,
    usedCoupons,
    expiredCoupons,
    useCoupon,
  };
});
