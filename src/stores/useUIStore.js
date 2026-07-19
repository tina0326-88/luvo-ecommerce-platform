// stores/useUIStore.js
import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    // Loading 狀態
    loading: false,
    loadingText: "載入中...",

    // Toast 通知
    toasts: [],

    // Modal 狀態
    modals: {
      cart: false,
      login: false,
      product: false,
      address: false,
      confirmation: false,
    },

    // 側邊欄狀態
    sidebar: {
      isOpen: false,
      type: null, // 'menu', 'cart', 'filter'
    },

    // 麵包屑導航
    breadcrumbs: [],

    // 頁面標題
    pageTitle: "Luvo",

    // 搜尋欄狀態
    searchBar: {
      isOpen: false,
      query: "",
    },

    // 確認對話框
    confirmation: {
      isOpen: false,
      title: "",
      message: "",
      confirmText: "確認",
      cancelText: "取消",
      onConfirm: null,
      onCancel: null,
    },

    // 螢幕尺寸
    screen: {
      width: typeof window !== "undefined" ? window.innerWidth : 1920,
      height: typeof window !== "undefined" ? window.innerHeight : 1080,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    },
  }),

  getters: {
    // 是否正在載入
    isLoading: (state) => state.loading,

    // 取得所有 Toast
    allToasts: (state) => state.toasts,

    // 是否有開啟的 Modal
    hasOpenModal: (state) => {
      return Object.values(state.modals).some((isOpen) => isOpen);
    },

    // 側邊欄是否開啟
    isSidebarOpen: (state) => state.sidebar.isOpen,

    // 是否為手機裝置
    isMobile: (state) => state.screen.isMobile,

    // 是否為平板裝置
    isTablet: (state) => state.screen.isTablet,

    // 是否為桌面裝置
    isDesktop: (state) => state.screen.isDesktop,
  },

  actions: {
    // ==================== Loading ====================

    // 顯示 Loading
    showLoading(text = "載入中...") {
      this.loading = true;
      this.loadingText = text;
    },

    // 隱藏 Loading
    hideLoading() {
      this.loading = false;
      this.loadingText = "載入中...";
    },

    // ==================== Toast 通知 ====================

    // 顯示 Toast 通知
    showToast({ message, type = "info", duration = 3000 }) {
      const id = Date.now();
      const toast = {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration,
      };

      this.toasts.push(toast);

      // 自動移除
      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }

      return id;
    },

    // 成功通知
    showSuccess(message, duration = 3000) {
      return this.showToast({ message, type: "success", duration });
    },

    // 錯誤通知
    showError(message, duration = 4000) {
      return this.showToast({ message, type: "error", duration });
    },

    // 警告通知
    showWarning(message, duration = 3000) {
      return this.showToast({ message, type: "warning", duration });
    },

    // 資訊通知
    showInfo(message, duration = 3000) {
      return this.showToast({ message, type: "info", duration });
    },

    // 移除 Toast
    removeToast(id) {
      const index = this.toasts.findIndex((toast) => toast.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },

    // 清除所有 Toast
    clearAllToasts() {
      this.toasts = [];
    },

    // ==================== Modal ====================

    // 開啟 Modal
    openModal(modalName) {
      if (this.modals.hasOwnProperty(modalName)) {
        this.modals[modalName] = true;
        // 防止背景滾動
        document.body.style.overflow = "hidden";
      }
    },

    // 關閉 Modal
    closeModal(modalName) {
      if (this.modals.hasOwnProperty(modalName)) {
        this.modals[modalName] = false;
        // 檢查是否還有其他 Modal 開啟
        if (!this.hasOpenModal) {
          document.body.style.overflow = "";
        }
      }
    },

    // 關閉所有 Modal
    closeAllModals() {
      Object.keys(this.modals).forEach((key) => {
        this.modals[key] = false;
      });
      document.body.style.overflow = "";
    },

    // 切換 Modal
    toggleModal(modalName) {
      if (this.modals[modalName]) {
        this.closeModal(modalName);
      } else {
        this.openModal(modalName);
      }
    },

    // ==================== Sidebar ====================

    // 開啟側邊欄
    openSidebar(type = "menu") {
      this.sidebar.isOpen = true;
      this.sidebar.type = type;
      document.body.style.overflow = "hidden";
    },

    // 關閉側邊欄
    closeSidebar() {
      this.sidebar.isOpen = false;
      this.sidebar.type = null;
      document.body.style.overflow = "";
    },

    // 切換側邊欄
    toggleSidebar(type = "menu") {
      if (this.sidebar.isOpen && this.sidebar.type === type) {
        this.closeSidebar();
      } else {
        this.openSidebar(type);
      }
    },

    // ==================== Breadcrumbs ====================

    // 設定麵包屑
    setBreadcrumbs(breadcrumbs) {
      this.breadcrumbs = breadcrumbs;
    },

    // 新增麵包屑
    addBreadcrumb(breadcrumb) {
      this.breadcrumbs.push(breadcrumb);
    },

    // 清除麵包屑
    clearBreadcrumbs() {
      this.breadcrumbs = [];
    },

    // ==================== Page Title ====================

    // 設定頁面標題
    setPageTitle(title) {
      this.pageTitle = title;
      document.title = `${title} - Luvo`;
    },

    // ==================== Search Bar ====================

    // 開啟搜尋欄
    openSearchBar() {
      this.searchBar.isOpen = true;
    },

    // 關閉搜尋欄
    closeSearchBar() {
      this.searchBar.isOpen = false;
      this.searchBar.query = "";
    },

    // 切換搜尋欄
    toggleSearchBar() {
      this.searchBar.isOpen = !this.searchBar.isOpen;
    },

    // 設定搜尋關鍵字
    setSearchQuery(query) {
      this.searchBar.query = query;
    },

    // ==================== Confirmation Dialog ====================

    // 顯示確認對話框
    showConfirmation({
      title,
      message,
      confirmText = "確認",
      cancelText = "取消",
    }) {
      return new Promise((resolve, reject) => {
        this.confirmation = {
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          onConfirm: () => {
            this.closeConfirmation();
            resolve(true);
          },
          onCancel: () => {
            this.closeConfirmation();
            reject(false);
          },
        };
      });
    },

    // 關閉確認對話框
    closeConfirmation() {
      this.confirmation.isOpen = false;
    },

    // ==================== Screen Size ====================

    // 更新螢幕尺寸
    updateScreenSize() {
      if (typeof window === "undefined") return;

      this.screen.width = window.innerWidth;
      this.screen.height = window.innerHeight;
      this.screen.isMobile = window.innerWidth < 768;
      this.screen.isTablet =
        window.innerWidth >= 768 && window.innerWidth < 1024;
      this.screen.isDesktop = window.innerWidth >= 1024;
    },

    // 初始化螢幕監聽
    initScreenListener() {
      if (typeof window === "undefined") return;

      this.updateScreenSize();
      window.addEventListener("resize", this.updateScreenSize);
    },

    // 移除螢幕監聽
    removeScreenListener() {
      if (typeof window === "undefined") return;

      window.removeEventListener("resize", this.updateScreenSize);
    },
  },
});
