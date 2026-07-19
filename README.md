# 皮鞋電商平台系統 Luvo Ecommerce Platform

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://router.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)

## 專案簡介

Luvo 履藝皮鞋是一個純前端電商平台展示專案，使用 Vue.js 3 及現代前端技術棧構建。本專案聚焦於前端工程實踐，包含前台購物體驗和後台管理系統的介面與互動邏輯，實現了響應式設計、狀態管理、路由控制等現代前端開發最佳實踐。

**專案性質說明**：本專案目前未串接真實後端，所有商品、訂單、會員資料皆為前端模擬（mock）資料，登入驗證、購物車、收藏清單等狀態透過 Pinia + 瀏覽器本地儲存（localStorage）模擬持久化。付款流程僅為 UI 展示，不涉及任何真實金流串接。

## 專案特色

- 完整的電商體驗：涵蓋商品展示、購物、結算、訂單管理等完整電商流程（前端模擬）
- 前後台分離：使用者購物前台 + 管理員後台系統
- 現代化架構：採用 Vue 3 Composition API 和模組化設計
- 響應式設計：完美支援桌面端、平板和移動設備
- 組件化開發：可重用的組件庫設計

## 測試帳號

以下帳號為前端內建的模擬帳號（寫在假資料 / mock API 中），僅供展示登入流程使用，並非真實後端驗證。

### 管理員帳號

- Email: `demo@luvo.com`
- 密碼: `123456`

### 一般帳戶

- Email: `user@luvo.com`
- 密碼: `user123`

## 核心功能

### 前台功能（使用者）

#### 商品瀏覽

- 商品系列
  - 皮鞋系列（牛津鞋、德比鞋、樂福鞋、孟克鞋）
  - 靴子系列（切爾西靴、馬丁靴、沙漠靴、工裝靴）
  - 休閒鞋系列（運動鞋、懶人鞋、帆布鞋、帆船鞋）
- 生活配件
  - 襪子（精梳棉、竹纖維、羊毛材質）
  - 皮帶（真皮、自動扣、雙面設計）
  - 包款系列（商務包、帆布托特包、旅行包）
- 進階篩選：款式、顏色、價格區間、材質
- 多種排序：價格、最新、最受歡迎
- 商品詳情：完整規格、評分系統、相關推薦

#### 購物體驗

- 購物車管理：即時更新、數量調整、本地持久化
- 收藏功能：心願清單、快速收藏、批量操作
- 優惠券系統
  - 現金券、折扣券、免運券
  - 優惠券領取和使用
  - 有效期限管理
- 模擬結帳流程：填寫收件資訊、選擇付款方式（UI 展示，未串接真實金流）

#### 會員系統

- 帳戶管理：用戶註冊、登入、個人資料編輯
- 訂單管理
  - 訂單狀態查詢（待付款、處理中、已出貨、已完成）
  - 物流追蹤資訊（模擬狀態顯示）
  - 訂單完成後評價
  - 取消訂單、確認收貨
- 地址管理
  - 新增、編輯、刪除收件地址
  - 設定預設地址
  - 城市區域聯動選擇

#### 其他功能

- 門市查詢
  - 全台 10 間門市資訊
  - 地區、城市篩選
  - 營業時間、服務項目
  - Google 地圖導航、電話撥打

### 後台功能（管理員）

#### 儀表板

- 數據統計：總銷售額、訂單數、商品數、會員數
- 成長率分析：月度增長趨勢
- 銷售趨勢圖：視覺化圖表展示
- 熱銷商品 TOP 5
- 最近訂單列表

#### 商品管理

- 商品列表
  - 完整商品資訊展示
  - 搜尋、篩選、排序功能
  - 庫存警示（顏色標示）
- 商品操作
  - 新增、編輯、刪除商品
  - 批量上架、下架
  - 批量刪除
  - 商品狀態管理
- 商品資訊
  - 商品編號、名稱、分類
  - 價格設定（售價、原價）
  - 庫存管理
  - 圖片上傳
  - 商品描述

#### 訂單管理

- 訂單統計：各狀態訂單數量統計
- 訂單列表
  - 訂單搜尋（訂單編號、客戶、電話）
  - 狀態篩選
  - 日期範圍篩選
- 訂單操作
  - 查看詳情
  - 更新訂單狀態
  - 列印訂單
  - 匯出訂單
- 訂單詳情
  - 客戶資訊
  - 商品清單
  - 金額明細（小計、運費、折扣）
  - 備註資訊

## 技術架構

### 核心框架

- Vue.js 3：使用 Composition API
- Pinia：狀態管理
- Vue Router 4：路由管理
- Vite：構建工具

### UI 與樣式

- Tailwind CSS：原子化 CSS 框架
- Heroicons / Lucide Icons：圖標庫
- Vue Transition：動畫效果

### 開發工具

- ESLint：代碼檢查
- Prettier：代碼格式化
- Git：版本控制

## 專案架構

```
luvo-ecommerce/
│
├── public/                          # 靜態資源
│   ├── favicon.ico
│   └── images/                      # 圖片資源
│
├── src/
│   ├── assets/                      # 資源文件
│   │   ├── images/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── tailwind.css
│   │   └── icons/
│   │
│   ├── components/                  # 組件目錄
│   │   ├── base/                    # 基礎組件
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   └── BasePagination.vue
│   │   ├── business/                # 業務組件
│   │   │   ├── ProductCard.vue
│   │   │   ├── CartItem.vue
│   │   │   └── OrderItem.vue
│   │   └── layout/                  # 佈局組件
│   │       ├── AppHeader.vue
│   │       ├── AppFooter.vue
│   │       └── AppSidebar.vue
│   │
│   ├── views/                       # 頁面視圖
│   │   ├── Home.vue                 # 首頁
│   │   │
│   │   ├── Products/                # 商品系列
│   │   │   ├── LeatherShoes.vue    # 皮鞋
│   │   │   ├── Boots.vue           # 靴子
│   │   │   └── CasualShoes.vue     # 休閒鞋
│   │   │
│   │   ├── Accessories/             # 生活配件
│   │   │   ├── Socks.vue           # 襪子
│   │   │   ├── Belts.vue           # 皮帶
│   │   │   └── Bags.vue            # 包款
│   │   │
│   │   ├── User/                    # 會員功能
│   │   │   ├── Login.vue           # 登入
│   │   │   ├── Register.vue        # 註冊
│   │   │   ├── Profile.vue         # 個人資料
│   │   │   ├── Orders.vue          # 訂單查詢
│   │   │   ├── Favorites.vue       # 收藏清單
│   │   │   ├── Addresses.vue       # 地址管理
│   │   │   └── Coupons.vue         # 我的優惠券
│   │   │
│   │   ├── Stores.vue               # 門市查詢
│   │   ├── Cart.vue                 # 購物車
│   │   ├── Checkout.vue             # 結算頁面
│   │   │
│   │   └── Admin/                   # 管理後台
│   │       ├── AdminLayout.vue     # 後台佈局
│   │       ├── Dashboard.vue       # 儀表板
│   │       ├── ProductManage.vue   # 商品管理
│   │       └── OrderManage.vue     # 訂單管理
│   │
│   ├── stores/                      # Pinia 狀態管理
│   │   ├── useUserStore.js
│   │   ├── useCartStore.js
│   │   ├── useProductStore.js
│   │   └── useOrderStore.js
│   │
│   ├── router/                      # 路由配置
│   │   ├── index.js
│   │   └── guards.js
│   │
│   ├── utils/                       # 工具函數
│   │   ├── api.js
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── App.vue                      # 根組件
│   └── main.js                      # 應用入口
│
├── .env.example                     # 環境變量模板
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 安裝與執行

### 前置需求

- Node.js 18.0.0 或以上版本
- npm 或 yarn 包管理器
- Git 版本控制工具

### 安裝步驟

#### 1. Clone 專案

```
git clone https://github.com/tina0326-88/luvo-ecommerce.git
cd luvo-ecommerce
```

#### 2. 安裝依賴

```
npm install
# 或
yarn install
```

#### 3. 環境配置（選用）

目前專案為純前端展示，.env 內的變數暫未實際生效，僅為未來串接後端時預留設定。若不打算串接後端，可略過此步驟直接啟動。

```
# 創建環境配置文件
cp .env.example .env
```

```
# 預留：未來串接後端 API 時使用
VITE_API_BASE_URL=http://localhost:3000/api

# 上傳文件大小限制 (MB)
VITE_MAX_FILE_SIZE=5

# 應用標題
VITE_APP_TITLE=Luvo 履藝皮鞋
```

#### 4. 啟動開發服務

```
npm run dev
# 或
yarn dev
```

訪問 `http://localhost:5173` 查看應用

## 可用指令

```
# 啟動開發服務器
npm run dev

# 生產構建
npm run build

# 預覽構建結果
npm run preview

# 代碼檢查
npm run lint

# 代碼格式化
npm run format
```

## 頁面導覽

### 前台頁面

| 頁面       | 路由                      | 說明                         |
| ---------- | ------------------------- | ---------------------------- |
| 首頁       | `/`                       | 品牌形象、新品展示、優惠活動 |
| 皮鞋系列   | `/products/leather-shoes` | 10款皮鞋商品                 |
| 靴子系列   | `/products/boots`         | 8款靴子商品                  |
| 休閒鞋系列 | `/products/casual-shoes`  | 10款休閒鞋商品               |
| 襪子       | `/accessories/socks`      | 6款襪子商品                  |
| 皮帶       | `/accessories/belts`      | 6款皮帶商品                  |
| 托特包     | `/accessories/bags`       | 6款托特包商品                |
| 門市查詢   | `/stores`                 | 全台10間門市資訊             |
| 購物車     | `/cart`                   | 購物車管理                   |
| 訂單查詢   | `/user/orders`            | 查看訂單狀態                 |
| 收藏清單   | `/user/favorites`         | 收藏的商品                   |
| 地址管理   | `/user/addresses`         | 收件地址管理                 |
| 我的優惠券 | `/user/coupons`           | 優惠券管理                   |

### 後台頁面

| 頁面     | 路由               | 說明           |
| -------- | ------------------ | -------------- |
| 儀表板   | `/admin/dashboard` | 數據統計和圖表 |
| 商品管理 | `/admin/products`  | 商品CRUD操作   |
| 訂單管理 | `/admin/orders`    | 訂單查詢和處理 |

## 版權聲明

此專案僅供個人學習與紀錄使用，無授權任何學習教材用途與商業用途。

## 致謝

感謝所有為這個專案提供建議和協助的人。
