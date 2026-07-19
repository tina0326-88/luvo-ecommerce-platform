import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Luvo 履藝 | 首頁" },
  },
  {
    path: "/discount",
    name: "Discount",
    component: () => import("../views/Discount.vue"),
    meta: { title: "買2送1 | Luvo 履藝" },
  },
  {
    path: "/new-member",
    name: "NewMember",
    component: () => import("../views/NewMember.vue"),
    meta: { title: "新會員首購禮 | Luvo 履藝" },
  },
  {
    path: "/brand",
    name: "Brand",
    component: () => import("../views/Brand.vue"),
    meta: { title: "品牌專屬優惠 | Luvo 履藝" },
  },
  {
    path: "/products",
    children: [
      {
        path: "leather-shoes",
        component: () => import("@/views/Products/LeatherShoes.vue"),
      },
      {
        path: "boots",
        component: () => import("@/views/Products/Boots.vue"),
      },
      {
        path: "casual-shoes",
        component: () => import("@/views/Products/CasualShoes.vue"),
      },
    ],
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
    meta: { title: "購物車 | Luvo 履藝" },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/User/Login.vue"),
    meta: { title: "登入 | Luvo 履藝" },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/User/Register.vue"),
    meta: { title: "註冊 | Luvo 履藝" },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../views/User/ForgotPassword.vue"),
    meta: { title: "忘記密碼 | Luvo 履藝" },
  },
  {
    path: "/stores",
    name: "Stores",
    component: () => import("@/views/Stores.vue"),
  },
  {
    path: "/user",
    children: [
      {
        path: "orders",
        component: () => import("@/views/User/Orders.vue"),
      },
      {
        path: "favorites",
        component: () => import("@/views/User/Favorites.vue"),
      },
      {
        path: "coupons",
        component: () => import("@/views/User/Coupons.vue"),
      },
    ],
  },
  // {
  //   path: "/admin",
  //   component: () => import("@/views/Admin/AdminLayout.vue"), // 管理後台佈局
  //   meta: { requiresAuth: true, requiresAdmin: true },
  //   children: [
  //     {
  //       path: "dashboard",
  //       name: "AdminDashboard",
  //       component: () => import("@/views/Admin/Dashboard.vue"),
  //     },
  //     {
  //       path: "products",
  //       name: "ProductManage",
  //       component: () => import("@/views/Admin/ProductManage.vue"),
  //     },
  //     // ... 其他管理頁面
  //   ],
  // },
  {
    path: "/accessories",
    children: [
      {
        path: "socks",
        component: () => import("@/views/Accessories/Socks.vue"),
      },
      {
        path: "belts",
        component: () => import("@/views/Accessories/Belts.vue"),
      },
      {
        path: "bags",
        component: () => import("@/views/Accessories/Bags.vue"),
      },
    ],
  },
  {
    path: "/user",
    children: [
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/User/Profile.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守衛
router.beforeEach((to, from, next) => {
  // 設置頁面標題
  document.title = to.meta.title || "Luvo 履藝";

  // 檢查是否需要登入
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
