<template>
  <div class="w-full">
    <!-- 標籤 -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-amber-500">*</span>
    </label>

    <!-- 輸入框容器 -->
    <div class="relative">
      <!-- 前綴圖標 -->
      <div
        v-if="$slots.prefix"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="prefix"></slot>
      </div>

      <!-- 輸入框 -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- 後綴圖標 -->
      <div
        v-if="$slots.suffix || showClearButton"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- 清除按鈕 -->
        <button
          v-if="showClearButton && modelValue"
          type="button"
          @click="clearInput"
          aria-label="清除輸入內容"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <slot v-else name="suffix"></slot>
      </div>
    </div>

    <!-- 提示訊息 -->
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>

    <!-- 錯誤訊息 -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, useSlots } from "vue";

const props = defineProps({
  // v-model 綁定的值
  modelValue: {
    type: [String, Number],
    default: "",
  },
  // 輸入框類型
  type: {
    type: String,
    default: "text",
  },
  // 標籤文字
  label: {
    type: String,
    default: "",
  },
  // 佔位符
  placeholder: {
    type: String,
    default: "",
  },
  // 提示訊息
  hint: {
    type: String,
    default: "",
  },
  // 錯誤訊息
  error: {
    type: String,
    default: "",
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否唯讀
  readonly: {
    type: Boolean,
    default: false,
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false,
  },
  // 是否顯示清除按鈕
  clearable: {
    type: Boolean,
    default: false,
  },
  // 輸入框尺寸
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "blur", "focus", "clear"]);

// 正確取得插槽的方式（props 上沒有 $slots）
const slots = useSlots();

// 生成唯一 ID
const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`);

// 是否顯示清除按鈕
const showClearButton = computed(() => {
  return props.clearable && !props.disabled && !props.readonly;
});

// 輸入框樣式
const inputClasses = computed(() => {
  const classes = [
    "block w-full rounded-lg border transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "disabled:bg-gray-100 disabled:cursor-not-allowed",
    "placeholder:text-gray-400",
  ];

  // 尺寸
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };
  classes.push(sizeClasses[props.size]);

  // 前綴和後綴間距
  if (slots.prefix) {
    classes.push("pl-10");
  }
  if (slots.suffix || showClearButton.value) {
    classes.push("pr-10");
  }

  // 錯誤狀態使用紅色，一般狀態使用品牌琥珀色，避免一 focus 就像出錯
  if (props.error) {
    classes.push("border-red-300 focus:border-red-500 focus:ring-red-500");
  } else {
    classes.push(
      "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
    );
  }

  return classes.join(" ");
});

// 處理輸入
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

// 處理失焦
const handleBlur = (event) => {
  emit("blur", event);
};

// 處理聚焦
const handleFocus = (event) => {
  emit("focus", event);
};

// 清除輸入
const clearInput = () => {
  emit("update:modelValue", "");
  emit("clear");
};
</script>