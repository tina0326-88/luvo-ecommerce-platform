<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2"
    aria-label="分頁導航"
  >
    <!-- 上一頁按鈕 -->
    <button
      type="button"
      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      :disabled="isFirstPage"
      @click="handlePrevious"
      aria-label="上一頁"
    >
      上一頁
    </button>

    <!-- 頁碼按鈕 -->
    <template v-if="simple">
      <span class="px-4 py-2 text-sm text-gray-700">
        {{ currentPage }} / {{ totalPages }}
      </span>
    </template>
    <template v-else>
      <button
        v-for="(page, index) in displayPages"
        :key="`${page}-${index}`"
        type="button"
        :class="[
          'min-w-[2.5rem] px-4 py-2 rounded-lg font-medium transition-colors',
          page === currentPage
            ? 'bg-amber-800 text-white'
            : page === '...'
              ? 'cursor-default'
              : 'border border-gray-300 hover:bg-gray-50',
        ]"
        :disabled="page === '...'"
        @click="handlePageChange(page)"
        :aria-label="page === '...' ? undefined : `第 ${page} 頁`"
        :aria-current="page === currentPage ? 'page' : undefined"
      >
        {{ page }}
      </button>
    </template>

    <!-- 下一頁按鈕 -->
    <button
      type="button"
      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      :disabled="isLastPage"
      @click="handleNext"
      aria-label="下一頁"
    >
      下一頁
    </button>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value >= 1,
  },
  total: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  pageSize: {
    type: Number,
    default: 12,
    validator: (value) => value > 0,
  },
  maxVisible: {
    type: Number,
    default: 7,
    validator: (value) => value >= 5 && value % 2 === 1,
  },
  simple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:currentPage", "change"]);

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize);
});

// 判斷是否為第一頁
const isFirstPage = computed(() => props.currentPage === 1);

// 判斷是否為最後一頁
const isLastPage = computed(() => props.currentPage >= totalPages.value);

// 計算要顯示的頁碼
const displayPages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = props.currentPage;
  const max = props.maxVisible;

  if (total <= max) {
    // 總頁數小於最大顯示數，顯示所有頁碼
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 總頁數大於最大顯示數，需要省略
    const half = Math.floor(max / 2);

    if (current <= half + 1) {
      // 當前頁在前面
      for (let i = 1; i <= max - 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - half) {
      // 當前頁在後面
      pages.push(1);
      pages.push("...");
      for (let i = total - max + 3; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // 當前頁在中間
      pages.push(1);
      pages.push("...");
      for (let i = current - half + 2; i <= current + half - 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

// 處理上一頁
const handlePrevious = () => {
  if (!isFirstPage.value) {
    handlePageChange(props.currentPage - 1);
  }
};

// 處理下一頁
const handleNext = () => {
  if (!isLastPage.value) {
    handlePageChange(props.currentPage + 1);
  }
};

// 處理頁碼變更
const handlePageChange = (page) => {
  if (page === "..." || page === props.currentPage) return;

  emit("update:currentPage", page);
  emit("change", page);

  // 滾動到頂部
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>