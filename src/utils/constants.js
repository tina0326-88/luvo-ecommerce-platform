// 全站導覽連結，AppHeader.vue 與行動版選單共用同一份資料，
// 避免像先前商品分類散落在各檔案裡各寫一次
export const NAV_LINKS = [
  { to: "/products/leather-shoes", label: "皮鞋系列" },
  { to: "/products/boots", label: "靴子系列" },
  { to: "/products/casual-shoes", label: "休閒鞋系列" },
  { to: "/accessories/socks", label: "襪子" },
  { to: "/accessories/belts", label: "皮帶" },
  { to: "/accessories/bags", label: "包款系列" },
  { to: "/stores", label: "門市查詢" },
];

// 訂單狀態文字與顏色，跟 OrderItem.vue 內定義的一致，
// 之後可以讓 OrderItem.vue 也改成 import 這裡的設定，只維護一份
export const ORDER_STATUS_MAP = {
  pending: { text: "待付款", class: "bg-yellow-500" },
  processing: { text: "處理中", class: "bg-blue-500" },
  shipped: { text: "已出貨", class: "bg-purple-500" },
  completed: { text: "已完成", class: "bg-green-500" },
  cancelled: { text: "已取消", class: "bg-gray-400" },
};

// 免運門檻與運費，跟 Cart.vue 內定義的一致
export const FREE_SHIPPING_THRESHOLD = 3000;
export const FLAT_SHIPPING_FEE = 100;

// 門市清單資料筆數（README 宣稱全台 10 間，Stores.vue 撰寫時要對齊這個數字）
export const STORE_COUNT = 10;