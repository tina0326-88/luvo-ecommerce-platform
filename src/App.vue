<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="!route.meta.hideDefaultLayout" />

    <main class="flex-1">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="currentRoute.fullPath" />
        </transition>
      </router-view>
    </main>

    <AppFooter v-if="!route.meta.hideDefaultLayout" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

const route = useRoute();
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>