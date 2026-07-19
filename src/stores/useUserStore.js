import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  // ============ State ============
  const user = ref(null);
  const token = ref(null);
  const isLoading = ref(false);
  const favorites = ref([]);

  // ============ Getters ============

  // 是否已登入
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value;
  });

  // 用戶全名
  const fullName = computed(() => {
    if (!user.value) return "";
    return user.value.lastName + user.value.firstName;
  });

  // 用戶等級
  const userLevel = computed(() => {
    if (!user.value) return "guest";
    const totalSpent = user.value.totalSpent || 0;

    if (totalSpent >= 50000) return "platinum";
    if (totalSpent >= 30000) return "gold";
    if (totalSpent >= 10000) return "silver";
    return "bronze";
  });

  // 用戶等級中文
  const userLevelName = computed(() => {
    const levelMap = {
      guest: "訪客",
      bronze: "銅級會員",
      silver: "銀級會員",
      gold: "金級會員",
      platinum: "白金會員",
    };
    return levelMap[userLevel.value];
  });

  // 距離下一等級還需消費金額
  const amountToNextLevel = computed(() => {
    if (!user.value) return 10000;
    const totalSpent = user.value.totalSpent || 0;

    if (totalSpent >= 50000) return 0;
    if (totalSpent >= 30000) return 50000 - totalSpent;
    if (totalSpent >= 10000) return 30000 - totalSpent;
    return 10000 - totalSpent;
  });

  // 可用積分
  const availablePoints = computed(() => {
    return user.value?.points || 0;
  });

  // 收藏商品數量
  const favoriteCount = computed(() => {
    return favorites.value.length;
  });

  // ============ Actions ============

  // 登入
  const login = async (credentials) => {
    isLoading.value = true;

    try {
      // 模擬 API 請求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模擬登入成功
      const mockUser = {
        id: 1,
        email: credentials.email,
        firstName: "小明",
        lastName: "王",
        phone: "0912345678",
        birthDate: "1990-01-01",
        gender: "male",
        totalSpent: 15000,
        points: 1500,
        avatar: null,
        joinDate: "2024-01-01",
        addresses: [
          {
            id: 1,
            name: "王小明",
            phone: "0912345678",
            city: "台北市",
            district: "大安區",
            address: "忠孝東路四段123號10樓",
            isDefault: true,
          },
        ],
      };

      const mockToken = "mock_token_" + Date.now();

      user.value = mockUser;
      token.value = mockToken;

      // 儲存到 localStorage
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      // 載入收藏
      loadFavorites();

      return { success: true, user: mockUser };
    } catch (error) {
      console.error("登入失敗:", error);
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 註冊
  const register = async (userData) => {
    isLoading.value = true;

    try {
      // 模擬 API 請求
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 模擬註冊成功後自動登入
      return await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      console.error("註冊失敗:", error);
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 登出
  const logout = () => {
    user.value = null;
    token.value = null;
    favorites.value = [];

    // 清除 localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("favorites");

    return { success: true };
  };

  // 更新用戶資料
  const updateProfile = async (updates) => {
    isLoading.value = true;

    try {
      // 模擬 API 請求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      user.value = { ...user.value, ...updates };

      // 更新 localStorage
      localStorage.setItem("user", JSON.stringify(user.value));

      return { success: true, user: user.value };
    } catch (error) {
      console.error("更新失敗:", error);
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 修改密碼
  const changePassword = async (oldPassword, newPassword) => {
    isLoading.value = true;

    try {
      // 模擬 API 請求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      console.error("修改密碼失敗:", error);
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // ============ 收藏功能 ============

  // 加入收藏
  const addFavorite = (product) => {
    if (favorites.value.some((fav) => fav.id === product.id)) {
      return { success: false, message: "商品已在收藏清單中" };
    }

    favorites.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      category: product.category,
      addedAt: new Date().toISOString(),
    });

    saveFavorites();
    return { success: true, message: "已加入收藏" };
  };

  // 移除收藏
  const removeFavorite = (productId) => {
    const index = favorites.value.findIndex((fav) => fav.id === productId);
    if (index > -1) {
      favorites.value.splice(index, 1);
      saveFavorites();
      return { success: true, message: "已移除收藏" };
    }
    return { success: false, message: "商品不在收藏清單中" };
  };

  // 切換收藏狀態
  const toggleFavorite = (product) => {
    if (isFavorited(product.id)) {
      return removeFavorite(product.id);
    } else {
      return addFavorite(product);
    }
  };

  // 檢查是否已收藏
  const isFavorited = (productId) => {
    return favorites.value.some((fav) => fav.id === productId);
  };

  // 清空收藏
  const clearFavorites = () => {
    if (confirm("確定要清空所有收藏嗎？")) {
      favorites.value = [];
      saveFavorites();
      return { success: true, message: "已清空收藏" };
    }
    return { success: false };
  };

  // ============ 地址管理 ============

  // 新增地址
  const addAddress = async (address) => {
    if (!user.value) return { success: false, error: "請先登入" };

    isLoading.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAddress = {
        id: Date.now(),
        ...address,
        isDefault: user.value.addresses.length === 0,
      };

      user.value.addresses.push(newAddress);
      localStorage.setItem("user", JSON.stringify(user.value));

      return { success: true, address: newAddress };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 更新地址
  const updateAddress = async (addressId, updates) => {
    if (!user.value) return { success: false, error: "請先登入" };

    const address = user.value.addresses.find((addr) => addr.id === addressId);
    if (!address) return { success: false, error: "地址不存在" };

    Object.assign(address, updates);
    localStorage.setItem("user", JSON.stringify(user.value));

    return { success: true, address };
  };

  // 刪除地址
  const deleteAddress = async (addressId) => {
    if (!user.value) return { success: false, error: "請先登入" };

    const index = user.value.addresses.findIndex(
      (addr) => addr.id === addressId
    );
    if (index === -1) return { success: false, error: "地址不存在" };

    if (confirm("確定要刪除此地址嗎？")) {
      user.value.addresses.splice(index, 1);
      localStorage.setItem("user", JSON.stringify(user.value));
      return { success: true };
    }

    return { success: false };
  };

  // 設定預設地址
  const setDefaultAddress = async (addressId) => {
    if (!user.value) return { success: false, error: "請先登入" };

    user.value.addresses.forEach((addr) => {
      addr.isDefault = addr.id === addressId;
    });

    localStorage.setItem("user", JSON.stringify(user.value));
    return { success: true };
  };

  // ============ 本地儲存 ============

  // 儲存收藏
  const saveFavorites = () => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites.value));
    } catch (error) {
      console.error("儲存收藏失敗:", error);
    }
  };

  // 載入收藏
  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        favorites.value = JSON.parse(saved);
      }
    } catch (error) {
      console.error("載入收藏失敗:", error);
    }
  };

  // 從 localStorage 載入用戶資料
  const loadFromLocalStorage = () => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
        loadFavorites();
      }
    } catch (error) {
      console.error("載入用戶資料失敗:", error);
    }
  };

  // ============ 初始化 ============

  // 載入本地儲存的資料
  loadFromLocalStorage();

  // ============ Return ============

  return {
    // State
    user,
    token,
    isLoading,
    favorites,

    // Getters
    isAuthenticated,
    fullName,
    userLevel,
    userLevelName,
    amountToNextLevel,
    availablePoints,
    favoriteCount,

    // Actions - 認證
    login,
    register,
    logout,
    updateProfile,
    changePassword,

    // Actions - 收藏
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    clearFavorites,

    // Actions - 地址
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,

    // 其他
    loadFromLocalStorage,
  };
});
