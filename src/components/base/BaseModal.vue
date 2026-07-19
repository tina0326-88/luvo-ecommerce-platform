<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- 背景遮罩：點擊處理事件要掛在這一層，因為使用者實際點到的是遮罩本身 -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleOverlayClick"
        ></div>

        <!-- 模態框主體 -->
        <div
          class="relative w-full max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden"
          :class="sizeClasses"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
        >
          <!-- 頭部 -->
          <div
            v-if="showHeader"
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
          >
            <h3
              v-if="title"
              id="modal-title"
              class="text-xl font-semibold text-gray-900"
            >
              {{ title }}
            </h3>
            <slot name="header" v-else></slot>

            <button
              v-if="showClose"
              type="button"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              @click="handleClose"
              aria-label="關閉"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 內容區域 -->
          <div class="px-6 py-4 overflow-y-auto" :class="contentClass">
            <slot></slot>
          </div>

          <!-- 底部 -->
          <div
            v-if="showFooter"
            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50"
          >
            <slot name="footer">
              <button
                type="button"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                @click="handleClose"
              >
                取消
              </button>
              <button
                type="button"
                class="px-4 py-2 text-white bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors"
                @click="handleConfirm"
              >
                確認
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl", "full"].includes(value),
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  closeOnEscape: {
    type: Boolean,
    default: true,
  },
  contentClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "close", "confirm"]);

const sizeClasses = computed(() => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };
  return sizes[props.size];
});

const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleConfirm = () => {
  emit("confirm");
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose();
  }
};

// 監聽 Esc 鍵關閉
const handleKeydown = (event) => {
  if (event.key === "Escape" && props.modelValue && props.closeOnEscape) {
    handleClose();
  }
};

// 開啟時鎖定背景捲動、監聽 Esc；關閉時還原
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeydown);
    }
  }
);

// 元件被卸載時（例如切換路由）務必還原捲動，避免其他頁面被鎖死
onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div:last-child {
  transform: scale(0.9);
}

.modal-leave-to > div:last-child {
  transform: scale(0.9);
}
</style>