import { createRouter, createWebHistory } from "vue-router";
import { setupGuards } from "./guards";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: { title: "首頁" },
  },

  // 商品系列
  {
    path: "/products/leather-shoes",
    name: "LeatherShoes",
    component: () => import("@/views/Products/LeatherShoes.vue"),
    meta: { title: "皮鞋系列" },
  },
  {
    path: "/products/boots",
    name: "Boots",
    component: () => import("@/views/Products/Boots.vue"),
    meta: { title: "靴子系列" },
  },
  {
    path: "/products/casual-shoes",
    name: "CasualShoes",
    component: () => import("@/views/Products/CasualShoes.vue"),
    meta: { title: "休閒鞋系列" },
  },
  {
    path: "/products/detail/:id",
    name: "ProductDetail",
    component: () => import("@/views/Products/ProductDetail.vue"),
    meta: { title: "商品詳情" },
  },

  // 生活配件
  {
    path: "/accessories/socks",
    name: "Socks",
    component: () => import("@/views/Accessories/Socks.vue"),
    meta: { title: "襪子" },
  },
  {
    path: "/accessories/belts",
    name: "Belts",
    component: () => import("@/views/Accessories/Belts.vue"),
    meta: { title: "皮帶" },
  },
  {
    path: "/accessories/bags",
    name: "Bags",
    component: () => import("@/views/Accessories/Bags.vue"),
    meta: { title: "包款系列" },
  },
  {
    path: "/stores",
    name: "Stores",
    component: () => import("@/views/Stores.vue"),
    meta: { title: "門市查詢" },
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("@/views/Cart.vue"),
    meta: { title: "購物車" },
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: () => import("@/views/Checkout.vue"),
    meta: { title: "結帳", requiresAuth: true },
  },

  // 會員功能
  {
    path: "/user/login",
    name: "Login",
    component: () => import("@/views/User/Login.vue"),
    meta: { title: "登入", guestOnly: true },
  },
  {
    path: "/user/register",
    name: "Register",
    component: () => import("@/views/User/Register.vue"),
    meta: { title: "註冊", guestOnly: true },
  },
  {
    path: "/user/profile",
    name: "Profile",
    component: () => import("@/views/User/Profile.vue"),
    meta: { title: "個人資料", requiresAuth: true },
  },
  {
    path: "/user/orders",
    name: "Orders",
    component: () => import("@/views/User/Orders.vue"),
    meta: { title: "訂單查詢", requiresAuth: true },
  },
  {
    path: "/user/orders/:id",
    name: "OrderDetail",
    component: () => import("@/views/User/OrderDetail.vue"),
    meta: { title: "訂單詳情", requiresAuth: true },
  },
  {
    path: "/user/favorites",
    name: "Favorites",
    component: () => import("@/views/User/Favorites.vue"),
    meta: { title: "收藏清單", requiresAuth: true },
  },
  {
    path: "/user/addresses",
    name: "Addresses",
    component: () => import("@/views/User/Addresses.vue"),
    meta: { title: "地址管理", requiresAuth: true },
  },
  {
    path: "/user/coupons",
    name: "Coupons",
    component: () => import("@/views/User/Coupons.vue"),
    meta: { title: "我的優惠券", requiresAuth: true },
  },

  // 後台管理
  {
    path: "/admin",
    component: () => import("@/views/Admin/AdminLayout.vue"),
    meta: { requiresAuth: true, requiresAdmin: true, hideDefaultLayout: true },
    children: [
      {
        path: "",
        redirect: { name: "AdminDashboard" },
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/Admin/Dashboard.vue"),
        meta: { title: "儀表板" },
      },
      {
        path: "products",
        name: "AdminProducts",
        component: () => import("@/views/Admin/ProductManage.vue"),
        meta: { title: "商品管理" },
      },
      {
        path: "orders",
        name: "AdminOrders",
        component: () => import("@/views/Admin/OrderManage.vue"),
        meta: { title: "訂單管理" },
      },
    ],
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: { title: "找不到頁面" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

setupGuards(router);

export default router;
