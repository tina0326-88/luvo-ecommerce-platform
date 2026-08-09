export const NAV_LINKS = [
  { to: "/products/leather-shoes", label: "皮鞋系列" },
  { to: "/products/boots", label: "靴子系列" },
  { to: "/products/casual-shoes", label: "休閒鞋系列" },
  { to: "/accessories/socks", label: "襪子" },
  { to: "/accessories/belts", label: "皮帶" },
  { to: "/accessories/bags", label: "包款系列" },
  { to: "/stores", label: "門市查詢" },
];

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

// 門市清單資料筆數
export const STORE_COUNT = 10;

// 城市／區域聯動選單資料。展示用途，僅列出部分縣市與行政區
export const CITY_DISTRICTS = {
  台北市: ["中正區", "大同區", "中山區", "松山區", "大安區", "信義區"],
  新北市: ["板橋區", "三重區", "中和區", "永和區", "新莊區", "淡水區"],
  台中市: ["中區", "西區", "北區", "西屯區", "南屯區", "北屯區"],
  台南市: ["中西區", "東區", "南區", "北區", "安平區", "安南區"],
  高雄市: ["新興區", "前金區", "苓雅區", "鹽埕區", "鼓山區", "三民區"],
  桃園市: ["桃園區", "中壢區", "平鎮區", "八德區", "龜山區", "蘆竹區"],
};
