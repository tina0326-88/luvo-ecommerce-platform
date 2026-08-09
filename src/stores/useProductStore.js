import { ref, computed } from "vue";
import { defineStore } from "pinia";

/**
 * 商品 Store
 *
 * 集中管理所有分類（皮鞋／靴子／休閒鞋）的商品資料，作為唯一資料來源。
 * 目前為前端 mock 資料；串接後端後，這裡的 products 改為透過 API 載入即可，
 * 其他元件（ProductCard、ProductDetail）不需要跟著調整。
 *
 * 注意：id 在跨分類間必須全域唯一（目前規劃 1-99 皮鞋、100-199 靴子、
 * 200-299 休閒鞋），避免像先前 Boots.vue 曾經發生過的重複 id 問題。
 */
export const useProductStore = defineStore("product", () => {
  const products = ref([
    // ------- 皮鞋系列 leather-shoes -------
    { id: 1, category: "leather-shoes", name: "紳士格調經典牛津皮鞋", price: 6980, originalPrice: 7980, style: "oxford", color: "black", material: "頭層牛皮", rating: 5, reviews: 156, stock: 9, image: "/images/product-1.jpg", isNew: false, discount: 13 },
    { id: 2, category: "leather-shoes", name: "摩登時尚簡約牛津皮鞋", price: 4980, originalPrice: null, style: "oxford", color: "brown", material: "頭層牛皮", rating: 4, reviews: 134, stock: 16, image: "/images/product-2.jpg", isNew: true, discount: 0 },
    { id: 3, category: "leather-shoes", name: "復古風範雕花牛津皮鞋", price: 7980, originalPrice: 8980, style: "oxford", color: "burgundy", material: "頭層牛皮 + 手工雕花", rating: 5, reviews: 98, stock: 4, image: "/images/product-3.jpg", isNew: true, discount: 11 },
    { id: 4, category: "leather-shoes", name: "商務精英德比皮鞋", price: 5980, originalPrice: null, style: "derby", color: "black", material: "頭層牛皮", rating: 4, reviews: 87, stock: 0, image: "/images/product-4.jpg", isNew: false, discount: 0 },
    { id: 5, category: "leather-shoes", name: "都會型男樂福鞋", price: 5400, originalPrice: null, style: "loafer", color: "brown", material: "小牛皮", rating: 5, reviews: 76, stock: 10, image: "/images/product-5.jpg", isNew: true, discount: 0 },
    { id: 6, category: "leather-shoes", name: "義式經典樂福鞋", price: 8800, originalPrice: 9800, style: "loafer", color: "tan", material: "義大利進口小牛皮", rating: 5, reviews: 112, stock: 6, image: "/images/product-6.jpg", isNew: false, discount: 10 },
    { id: 7, category: "leather-shoes", name: "雙扣孟克鞋", price: 7680, originalPrice: null, style: "monk", color: "brown", material: "頭層牛皮", rating: 4, reviews: 64, stock: 13, image: "/images/product-7.jpg", isNew: true, discount: 0 },
    { id: 8, category: "leather-shoes", name: "紳士雕花德比鞋", price: 6780, originalPrice: 7580, style: "derby", color: "burgundy", material: "頭層牛皮 + 雕花", rating: 5, reviews: 89, stock: 2, image: "/images/product-8.jpg", isNew: false, discount: 11 },
    { id: 9, category: "leather-shoes", name: "時尚尖頭牛津鞋", price: 5880, originalPrice: null, style: "oxford", color: "black", material: "漆皮", rating: 4, reviews: 45, stock: 8, image: "/images/product-9.jpg", isNew: true, discount: 0 },

    // ------- 靴子系列 boots -------
    { id: 101, category: "boots", name: "經典切爾西靴", price: 8980, originalPrice: null, style: "chelsea", color: "black", material: "頭層牛皮", features: ["彈性側邊", "防滑鞋底"], waterproof: false, rating: 5, reviews: 145, stock: 12, image: "/images/product-10.jpg", isNew: true, discount: 0 },
    { id: 102, category: "boots", name: "工裝馬丁靴", price: 7680, originalPrice: 8980, style: "martin", color: "black", material: "油蠟皮", features: ["防水", "耐磨", "8孔設計"], waterproof: true, rating: 5, reviews: 234, stock: 8, image: "/images/product-11.jpg", isNew: false, discount: 14 },
    { id: 103, category: "boots", name: "經典沙漠靴", price: 6280, originalPrice: null, style: "chukka", color: "tan", material: "磨砂皮", features: ["透氣", "輕量"], waterproof: false, rating: 4, reviews: 98, stock: 3, image: "/images/product-12.jpg", isNew: true, discount: 0 },
    { id: 104, category: "boots", name: "復古工裝靴", price: 9280, originalPrice: 10280, style: "work", color: "brown", material: "油蠟皮", features: ["防水", "鋼頭", "防滑"], waterproof: true, rating: 5, reviews: 167, stock: 6, image: "/images/product-13.jpg", isNew: false, discount: 10 },
    { id: 105, category: "boots", name: "紳士切爾西靴", price: 10800, originalPrice: null, style: "chelsea", color: "brown", material: "義大利進口小牛皮", features: ["固特異工藝", "真皮內裡"], waterproof: false, rating: 5, reviews: 89, stock: 0, image: "/images/product-14.jpg", isNew: true, discount: 0 },
    { id: 106, category: "boots", name: "街頭馬丁靴", price: 6980, originalPrice: 7980, style: "martin", color: "black", material: "光面皮", features: ["經典8孔", "防滑鞋底"], waterproof: false, rating: 4, reviews: 203, stock: 15, image: "/images/product-15.jpg", isNew: false, discount: 13 },
    { id: 107, category: "boots", name: "都會沙漠靴", price: 7480, originalPrice: null, style: "chukka", color: "gray", material: "磨砂皮", features: ["輕量", "透氣"], waterproof: false, rating: 4, reviews: 76, stock: 9, image: "/images/product-16.jpg", isNew: true, discount: 0 },
    { id: 108, category: "boots", name: "防水工裝靴", price: 8680, originalPrice: 9480, style: "work", color: "tan", material: "防水皮革", features: ["全防水", "耐磨鞋底", "加厚鞋墊"], waterproof: true, rating: 5, reviews: 134, stock: 4, image: "/images/product-17.jpg", isNew: false, discount: 8 },
    { id: 109, category: "boots", name: "重裝防水工裝靴", price: 9480, originalPrice: 10280, style: "work", color: "black", material: "防水皮革", features: ["全防水", "鋼頭", "耐磨鞋底"], waterproof: true, rating: 5, reviews: 61, stock: 10, image: "/images/product-18.jpg", isNew: true, discount: 8 },

    // ------- 休閒鞋系列 casual-shoes -------
    { id: 201, category: "casual-shoes", name: "時尚休閒運動鞋", price: 3980, originalPrice: 4980, style: "sneaker", color: "white", material: "網布 + 真皮", features: ["透氣", "輕量", "氣墊"], rating: 5, reviews: 312, stock: 20, image: "/images/casual-1.jpg", isNew: true, isHot: true, discount: 20 },
    { id: 202, category: "casual-shoes", name: "經典帆布休閒鞋", price: 2280, originalPrice: null, style: "canvas", color: "white", material: "帆布", features: ["透氣", "經典款"], rating: 4, reviews: 234, stock: 2, image: "/images/casual-2.jpg", isNew: false, isHot: true, discount: 0 },
    { id: 203, category: "casual-shoes", name: "懶人一腳蹬休閒鞋", price: 3480, originalPrice: null, style: "slip-on", color: "black", material: "小牛皮", features: ["輕鬆穿脫", "柔軟"], rating: 5, reviews: 189, stock: 11, image: "/images/casual-3.jpg", isNew: true, isHot: false, discount: 0 },
    { id: 204, category: "casual-shoes", name: "經典帆船鞋", price: 4280, originalPrice: 4980, style: "boat", color: "brown", material: "真皮", features: ["防滑", "經典款"], rating: 4, reviews: 156, stock: 0, image: "/images/casual-4.jpg", isNew: false, isHot: false, discount: 14 },
    { id: 205, category: "casual-shoes", name: "輕量運動休閒鞋", price: 3680, originalPrice: null, style: "sneaker", color: "gray", material: "飛織網布", features: ["超輕量", "透氣", "彈力"], rating: 5, reviews: 267, stock: 18, image: "/images/casual-5.jpg", isNew: true, isHot: true, discount: 0 },
    { id: 206, category: "casual-shoes", name: "復古帆布鞋", price: 2680, originalPrice: 2980, style: "canvas", color: "blue", material: "帆布", features: ["復古風", "百搭"], rating: 4, reviews: 198, stock: 7, image: "/images/casual-6.jpg", isNew: false, isHot: false, discount: 10 },
    { id: 207, category: "casual-shoes", name: "商務懶人鞋", price: 4580, originalPrice: null, style: "slip-on", color: "black", material: "頭層牛皮", features: ["商務", "舒適"], rating: 5, reviews: 143, stock: 5, image: "/images/casual-7.jpg", isNew: true, isHot: false, discount: 0 },
    { id: 208, category: "casual-shoes", name: "麂皮帆船鞋", price: 4880, originalPrice: 5480, style: "boat", color: "brown", material: "麂皮", features: ["防滑", "質感"], rating: 4, reviews: 112, stock: 3, image: "/images/casual-8.jpg", isNew: false, isHot: false, discount: 11 },
    { id: 209, category: "casual-shoes", name: "透氣網面運動鞋", price: 2980, originalPrice: null, style: "sneaker", color: "white", material: "網布", features: ["透氣", "輕量", "運動"], rating: 4, reviews: 289, stock: 14, image: "/images/casual-9.jpg", isNew: true, isHot: true, discount: 0 },
  ]);

  const categoryLabels = {
    "leather-shoes": "皮鞋系列",
    boots: "靴子系列",
    "casual-shoes": "休閒鞋系列",
  };

  // 依 id 取得單一商品（ProductDetail.vue 使用）
  const getProductById = (id) => {
    const numericId = Number(id);
    return products.value.find((p) => p.id === numericId) || null;
  };

  // 依分類取得商品清單（分類頁未來可改用這裡，取代各頁面內建的假資料）
  const getProductsByCategory = (category) => {
    return products.value.filter((p) => p.category === category);
  };

  // 相關商品推薦：同分類、排除自己，取前 4 筆
  const getRelatedProducts = (product, limit = 4) => {
    if (!product) return [];
    return products.value
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  };

  const totalCount = computed(() => products.value.length);

  return {
    products,
    categoryLabels,
    totalCount,
    getProductById,
    getProductsByCategory,
    getRelatedProducts,
  };
});