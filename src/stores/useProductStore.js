// stores/useProductStore.js
import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    // 所有商品
    products: [
      // ==================== 皮鞋分類 ====================
      {
        id: 1,
        name: "【Luvo】紳士格調經典牛津皮鞋",
        category: "leather-shoes",
        image: "/images/product-1.jpg",
        images: ["/images/product-1.jpg", "/images/product-1-2.jpg"],
        originalPrice: 6980,
        salePrice: 6980,
        discount: 0,
        rating: 5,
        reviews: 128,
        stock: 50,
        isNew: true,
        isFavorite: false,
        sizes: ["40", "41", "42", "43"],
        colors: ["黑色", "棕色"],
        description:
          "經典牛津皮鞋，採用優質頭層牛皮製作，鞋底使用橡膠材質，舒適耐穿。",
        features: ["頭層牛皮", "橡膠鞋底", "透氣鞋墊", "手工縫製"],
      },
      {
        id: 2,
        name: "【Luvo】摩登時尚簡約牛津皮鞋",
        category: "leather-shoes",
        image: "/images/product-2.jpg",
        images: ["/images/product-2.jpg"],
        originalPrice: 5980,
        salePrice: 4980,
        discount: 15,
        rating: 4,
        reviews: 86,
        stock: 35,
        isNew: false,
        isFavorite: false,
        sizes: ["39", "40", "41", "42"],
        colors: ["黑色", "咖啡色"],
        description: "簡約設計牛津皮鞋，適合商務與休閒場合。",
        features: ["真皮材質", "輕量設計", "防滑鞋底"],
      },
      {
        id: 3,
        name: "【Luvo】復古風範雕花牛津皮鞋",
        category: "leather-shoes",
        image: "/images/product-3.jpg",
        images: ["/images/product-3.jpg"],
        originalPrice: 7980,
        salePrice: 7980,
        discount: 0,
        rating: 5,
        reviews: 95,
        stock: 28,
        isNew: true,
        isFavorite: false,
        sizes: ["41", "42", "43", "44"],
        colors: ["棕色", "黑色"],
        description: "復古雕花設計，展現獨特品味。",
        features: ["手工雕花", "頭層牛皮", "復古鞋楦"],
      },

      // ==================== 靴子分類 ====================
      {
        id: 4,
        name: "【Luvo】經典切爾西靴",
        category: "boots",
        image: "/images/boot-1.jpg",
        images: ["/images/boot-1.jpg"],
        originalPrice: 8980,
        salePrice: 8980,
        discount: 0,
        rating: 5,
        reviews: 76,
        stock: 42,
        isNew: true,
        isFavorite: false,
        sizes: ["40", "41", "42", "43"],
        colors: ["黑色", "深棕色"],
        description: "經典切爾西靴設計，搭配彈性側邊，穿脫方便。",
        features: ["彈性側邊", "防水處理", "厚底設計"],
      },
      {
        id: 5,
        name: "【Luvo】工裝風格馬丁靴",
        category: "boots",
        image: "/images/boot-2.jpg",
        images: ["/images/boot-2.jpg"],
        originalPrice: 9980,
        salePrice: 8980,
        discount: 10,
        rating: 4,
        reviews: 62,
        stock: 30,
        isNew: false,
        isFavorite: false,
        sizes: ["39", "40", "41", "42"],
        colors: ["黑色", "棕色"],
        description: "工裝風格馬丁靴，堅固耐用。",
        features: ["厚底設計", "防滑鞋底", "耐磨材質"],
      },
      {
        id: 6,
        name: "【Luvo】商務正裝短靴",
        category: "boots",
        image: "/images/boot-3.jpg",
        images: ["/images/boot-3.jpg"],
        originalPrice: 7980,
        salePrice: 7980,
        discount: 0,
        rating: 5,
        reviews: 88,
        stock: 38,
        isNew: true,
        isFavorite: false,
        sizes: ["40", "41", "42", "43", "44"],
        colors: ["黑色"],
        description: "商務正裝短靴，適合正式場合。",
        features: ["真皮材質", "舒適鞋墊", "經典設計"],
      },

      // ==================== 休閒鞋分類 ====================
      {
        id: 7,
        name: "【Luvo】輕量運動休閒鞋",
        category: "casual-shoes",
        image: "/images/casual-1.jpg",
        images: ["/images/casual-1.jpg"],
        originalPrice: 3980,
        salePrice: 3480,
        discount: 13,
        rating: 4,
        reviews: 145,
        stock: 80,
        isNew: false,
        isFavorite: false,
        sizes: ["39", "40", "41", "42", "43"],
        colors: ["白色", "黑色", "灰色"],
        description: "輕量設計運動休閒鞋，透氣舒適。",
        features: ["輕量設計", "透氣網布", "彈性鞋底"],
      },
      {
        id: 8,
        name: "【Luvo】帆布休閒鞋",
        category: "casual-shoes",
        image: "/images/casual-2.jpg",
        images: ["/images/casual-2.jpg"],
        originalPrice: 2980,
        salePrice: 2980,
        discount: 0,
        rating: 4,
        reviews: 102,
        stock: 65,
        isNew: false,
        isFavorite: false,
        sizes: ["38", "39", "40", "41", "42"],
        colors: ["白色", "深藍色", "黑色"],
        description: "經典帆布休閒鞋，百搭款式。",
        features: ["帆布材質", "橡膠鞋底", "經典設計"],
      },
      {
        id: 9,
        name: "【Luvo】極簡風樂福鞋",
        category: "casual-shoes",
        image: "/images/casual-3.jpg",
        images: ["/images/casual-3.jpg"],
        originalPrice: 4980,
        salePrice: 4480,
        discount: 10,
        rating: 5,
        reviews: 67,
        stock: 45,
        isNew: true,
        isFavorite: false,
        sizes: ["39", "40", "41", "42", "43"],
        colors: ["黑色", "棕色", "白色"],
        description: "極簡風格樂福鞋，穿脫方便。",
        features: ["真皮材質", "一腳蹬設計", "舒適鞋墊"],
      },
    ],

    // 當前商品
    currentProduct: null,

    // 分類資訊
    categories: [
      { id: "all", name: "全部商品", slug: "all" },
      { id: "leather-shoes", name: "皮鞋", slug: "leather-shoes" },
      { id: "boots", name: "靴子", slug: "boots" },
      { id: "casual-shoes", name: "休閒鞋", slug: "casual-shoes" },
      { id: "accessories", name: "配件", slug: "accessories" },
    ],

    // Loading 狀態
    loading: false,
    error: null,
  }),

  getters: {
    // 取得所有商品
    allProducts: (state) => state.products,

    // 依分類取得商品
    productsByCategory: (state) => (category) => {
      if (category === "all" || !category) {
        return state.products;
      }
      return state.products.filter((p) => p.category === category);
    },

    // 皮鞋分類
    leatherShoes: (state) => {
      return state.products.filter((p) => p.category === "leather-shoes");
    },

    // 靴子分類
    boots: (state) => {
      return state.products.filter((p) => p.category === "boots");
    },

    // 休閒鞋分類
    casualShoes: (state) => {
      return state.products.filter((p) => p.category === "casual-shoes");
    },

    // 新品
    newProducts: (state) => {
      return state.products.filter((p) => p.isNew);
    },

    // 特價商品
    saleProducts: (state) => {
      return state.products.filter((p) => p.discount > 0);
    },

    // 熱門商品（依評論數排序）
    popularProducts: (state) => {
      return [...state.products]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 6);
    },

    // 取得單一商品
    getProductById: (state) => (id) => {
      return state.products.find((p) => p.id === parseInt(id));
    },

    // 取得分類資訊
    getCategoryBySlug: (state) => (slug) => {
      return state.categories.find((c) => c.slug === slug);
    },
  },

  actions: {
    // 獲取所有商品（模擬 API 呼叫）
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        // TODO: 實際的 API 呼叫
        // const response = await fetch('/api/products')
        // const data = await response.json()
        // this.products = data

        await new Promise((resolve) => setTimeout(resolve, 500));

        // 商品資料已在 state 中
        return this.products;
      } catch (error) {
        this.error = error.message;
        console.error("獲取商品失敗:", error);
      } finally {
        this.loading = false;
      }
    },

    // 獲取單一商品
    async fetchProduct(id) {
      this.loading = true;
      this.error = null;

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const product = this.getProductById(id);
        this.currentProduct = product;
        return product;
      } catch (error) {
        this.error = error.message;
        console.error("獲取商品失敗:", error);
      } finally {
        this.loading = false;
      }
    },

    // 切換收藏
    toggleFavorite(productId) {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        product.isFavorite = !product.isFavorite;
      }
    },

    // 搜尋商品
    searchProducts(query) {
      const lowerQuery = query.toLowerCase();
      return this.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description?.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
        );
      });
    },

    // 篩選商品
    filterProducts(filters) {
      let result = [...this.products];

      // 分類篩選
      if (filters.category && filters.category !== "all") {
        result = result.filter((p) => p.category === filters.category);
      }

      // 價格篩選
      if (filters.minPrice !== undefined) {
        result = result.filter((p) => p.salePrice >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        result = result.filter((p) => p.salePrice <= filters.maxPrice);
      }

      // 尺寸篩選
      if (filters.sizes && filters.sizes.length > 0) {
        result = result.filter((p) => {
          return filters.sizes.some((size) => p.sizes.includes(size));
        });
      }

      // 顏色篩選
      if (filters.colors && filters.colors.length > 0) {
        result = result.filter((p) => {
          return filters.colors.some((color) => p.colors.includes(color));
        });
      }

      // 評分篩選
      if (filters.minRating) {
        result = result.filter((p) => p.rating >= filters.minRating);
      }

      return result;
    },

    // 排序商品
    sortProducts(products, sortBy) {
      const sorted = [...products];

      switch (sortBy) {
        case "price-asc":
          return sorted.sort((a, b) => a.salePrice - b.salePrice);
        case "price-desc":
          return sorted.sort((a, b) => b.salePrice - a.salePrice);
        case "newest":
          return sorted.sort((a, b) => b.isNew - a.isNew);
        case "popular":
          return sorted.sort((a, b) => b.reviews - a.reviews);
        case "rating":
          return sorted.sort((a, b) => b.rating - a.rating);
        default:
          return sorted;
      }
    },
  },
});
