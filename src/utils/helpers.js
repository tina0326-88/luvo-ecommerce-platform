/**
 * 格式化價格為千分位字串（不含 NT$ 字首，字首由呼叫端自行加上，
 * 方便同一個函式套用在不同幣別／不同語系文字前綴的情境）
 * @param {number} price
 * @returns {string} 例如 1234567 -> "1,234,567"
 */
export function formatPrice(price) {
  return (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 格式化日期為 YYYY/MM/DD（zh-TW 慣用格式）
 * @param {string|Date} dateInput ISO 字串或 Date 物件
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return "";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * 計算折扣後價格，統一四捨五入，避免出現角、分
 * @param {number} price 原價
 * @param {number} discountPercent 折扣百分比，例如 15 代表折抵 15%
 * @returns {number}
 */
export function calcDiscountedPrice(price, discountPercent) {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

/**
 * 安全讀取 localStorage 並 parse JSON，避免每個檔案各自寫一份 try/catch
 * @param {string} key
 * @param {*} fallback 讀取失敗或不存在時的預設值
 */
export function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * 安全寫入 localStorage
 * @param {string} key
 * @param {*} value 會被 JSON.stringify
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 忽略寫入失敗（例如無痕模式、儲存空間已滿），避免中斷使用者操作
  }
}

/**
 * 產生模擬訂單編號（前端展示用，實際串接後端後應改由後端產生）
 * @returns {string} 例如 "LV20260809-4821"
 */
export function generateOrderNumber() {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `LV${datePart}-${randomPart}`;
}