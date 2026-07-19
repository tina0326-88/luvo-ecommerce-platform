<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :aria-busy="loading"
    @click="handleClick"
  >
    <!-- Loading 圖標 -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span v-if="loading" class="sr-only">載入中</span>

    <!-- 按鈕內容 -->
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 按鈕類型：primary, secondary, outline, text
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "outline", "text", "danger"].includes(value),
  },
  // 按鈕尺寸：sm, md, lg
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  // HTML type 屬性
  type: {
    type: String,
    default: "button",
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否載入中
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否為區塊級按鈕
  block: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

// 按鈕樣式類別
const buttonClasses = computed(() => {
  const classes = [
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ];

  // 尺寸
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  classes.push(sizeClasses[props.size]);

  // 變體樣式
  const variantClasses = {
    primary: "bg-amber-800 text-white hover:bg-amber-900 focus:ring-amber-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border-2 border-amber-800 text-amber-800 hover:bg-amber-50 focus:ring-amber-500",
    text: "text-amber-800 hover:bg-amber-50 focus:ring-amber-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  classes.push(variantClasses[props.variant]);

  // 區塊級按鈕
  if (props.block) {
    classes.push("w-full");
  }

  return classes.join(" ");
});

// 處理點擊事件
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>