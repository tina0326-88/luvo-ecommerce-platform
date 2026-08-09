<template>
  <aside
    class="bg-gray-900 text-gray-300 flex flex-col transition-all duration-200"
    :class="collapsed ? 'w-20' : 'w-64'"
  >
    <!-- Logo 區 -->
    <div
      class="h-16 flex items-center justify-between px-4 border-b border-gray-800"
    >
      <router-link
        to="/admin/dashboard"
        class="text-white font-bold text-xl"
        :class="collapsed ? 'hidden' : 'block'"
      >
        LUVO 後台
      </router-link>
      <button
        class="text-gray-400 hover:text-white transition-colors"
        :aria-label="collapsed ? '展開選單' : '收合選單'"
        @click="$emit('toggle-collapsed')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="collapsed"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7M19 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <!-- 導覽項目 -->
    <nav class="flex-1 py-4 space-y-1">
      <router-link
        v-for="link in navItems"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-colors"
        :class="[
          isActive(link.to)
            ? 'bg-amber-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
        :title="collapsed ? link.label : undefined"
      >
        <component :is="link.icon" class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed">{{ link.label }}</span>
      </router-link>
    </nav>

    <!-- 底部：管理員資訊 + 登出 -->
    <div class="border-t border-gray-800 p-4">
      <div v-if="!collapsed" class="mb-3">
        <p class="text-sm text-white font-medium truncate">
          {{ userStore.currentUser?.name }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          {{ userStore.currentUser?.email }}
        </p>
      </div>
      <button
        class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        @click="$emit('logout-request')"
      >
        <svg
          class="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span v-if="!collapsed">登出</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { h } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle-collapsed", "logout-request"]);

const route = useRoute();
const userStore = useUserStore();

// 簡易 icon：用 render function 就地產生 SVG，避免額外引入 icon 套件
const makeIcon = (pathD) => ({
  render: () =>
    h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: pathD,
        }),
      ],
    ),
});

const navItems = [
  {
    to: "/admin/dashboard",
    label: "儀表板",
    icon: makeIcon(
      "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    ),
  },
  {
    to: "/admin/products",
    label: "商品管理",
    icon: makeIcon(
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ),
  },
  {
    to: "/admin/orders",
    label: "訂單管理",
    icon: makeIcon(
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    ),
  },
];

const isActive = (path) => route.path.startsWith(path);
</script>
