<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面橫幅 -->
    <div class="relative h-72 overflow-hidden">
      <img
        src="/images/luvo-leather-shoes-1.jpg"
        alt="門市查詢"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-5xl font-bold mb-3">門市查詢</h1>
          <p class="text-xl">全台 {{ stores.length }} 間門市，歡迎親臨體驗</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- 篩選 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">地區</label>
            <select
              v-model="filterRegion"
              @change="filterCity = ''"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部地區</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">城市</label>
            <select
              v-model="filterCity"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">全部城市</option>
              <option v-for="city in cityOptions" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 門市列表 -->
      <div v-if="filteredStores.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="store in filteredStores"
          :key="store.id"
          class="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-gray-800">{{ store.name }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ store.region }}・{{ store.city }}</p>
              </div>
              <span
                v-if="store.isFlagship"
                class="text-xs px-2 py-1 bg-amber-800 text-white rounded-full shrink-0"
              >
                旗艦店
              </span>
            </div>

            <div class="space-y-2 text-sm text-gray-600">
              <p class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ store.address }}</span>
              </p>
              <p class="flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ store.hours }}</span>
              </p>
              <p class="flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ store.phone }}</span>
              </p>
            </div>

            <div v-if="store.services.length" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="service in store.services"
                :key="service"
                class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {{ service }}
              </span>
            </div>

            <!-- 操作改用 button + click 事件處理，完全不使用 <a> 標籤 -->
            <div class="flex gap-2 mt-4">
              <button
                type="button"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                @click="openMap(store)"
              >
                地圖導航
              </button>
              <button
                type="button"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-amber-800 text-white hover:bg-amber-900 transition-colors"
                @click="callStore(store)"
              >
                撥打電話
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-24">
        <p class="text-gray-500 text-lg">找不到符合條件的門市</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const stores = ref([
  {
    id: 1,
    name: "Luvo 台北信義旗艦店",
    region: "北部",
    city: "台北市",
    address: "台北市信義區松高路 12 號",
    hours: "週一至週日 11:00 - 22:00",
    phone: "02-2345-6789",
    services: ["皮鞋保養", "客製訂做", "免費停車"],
    isFlagship: true,
  },
  {
    id: 2,
    name: "Luvo 台北大安店",
    region: "北部",
    city: "台北市",
    address: "台北市大安區敦化南路一段 88 號",
    hours: "週一至週日 11:00 - 21:30",
    phone: "02-2711-2233",
    services: ["皮鞋保養"],
    isFlagship: false,
  },
  {
    id: 3,
    name: "Luvo 新北板橋店",
    region: "北部",
    city: "新北市",
    address: "新北市板橋區文化路二段 55 號",
    hours: "週一至週日 11:00 - 21:30",
    phone: "02-8965-4321",
    services: ["皮鞋保養", "免費停車"],
    isFlagship: false,
  },
  {
    id: 4,
    name: "Luvo 桃園中壢店",
    region: "北部",
    city: "桃園市",
    address: "桃園市中壢區中央西路 20 號",
    hours: "週一至週日 11:00 - 21:00",
    phone: "03-422-7788",
    services: ["皮鞋保養"],
    isFlagship: false,
  },
  {
    id: 5,
    name: "Luvo 台中崇德店",
    region: "中部",
    city: "台中市",
    address: "台中市北屯區崇德路二段 66 號",
    hours: "週一至週日 11:00 - 21:30",
    phone: "04-2246-1122",
    services: ["皮鞋保養", "客製訂做"],
    isFlagship: true,
  },
  {
    id: 6,
    name: "Luvo 台中西屯店",
    region: "中部",
    city: "台中市",
    address: "台中市西屯區台灣大道三段 301 號",
    hours: "週一至週日 11:00 - 21:00",
    phone: "04-2359-8877",
    services: ["免費停車"],
    isFlagship: false,
  },
  {
    id: 7,
    name: "Luvo 台南中西店",
    region: "南部",
    city: "台南市",
    address: "台南市中西區中山路 45 號",
    hours: "週一至週日 11:00 - 21:00",
    phone: "06-221-3344",
    services: ["皮鞋保養"],
    isFlagship: false,
  },
  {
    id: 8,
    name: "Luvo 高雄三多店",
    region: "南部",
    city: "高雄市",
    address: "高雄市苓雅區三多三路 100 號",
    hours: "週一至週日 11:00 - 22:00",
    phone: "07-335-6677",
    services: ["皮鞋保養", "客製訂做", "免費停車"],
    isFlagship: true,
  },
  {
    id: 9,
    name: "Luvo 高雄左營店",
    region: "南部",
    city: "高雄市",
    address: "高雄市左營區博愛二路 168 號",
    hours: "週一至週日 11:00 - 21:30",
    phone: "07-556-9900",
    services: ["皮鞋保養"],
    isFlagship: false,
  },
  {
    id: 10,
    name: "Luvo 花蓮市區店",
    region: "東部",
    city: "花蓮縣",
    address: "花蓮縣花蓮市中山路 30 號",
    hours: "週二至週日 11:00 - 20:00（週一公休）",
    phone: "03-833-5566",
    services: ["皮鞋保養"],
    isFlagship: false,
  },
]);

const regions = computed(() => {
  const set = new Set();
  for (const s of stores.value) set.add(s.region);
  return Array.from(set);
});

const filterRegion = ref("");
const filterCity = ref("");

const cityOptions = computed(() => {
  const set = new Set();
  const source = filterRegion.value
    ? stores.value.filter((s) => s.region === filterRegion.value)
    : stores.value;
  for (const s of source) set.add(s.city);
  return Array.from(set);
});

const filteredStores = computed(() => {
  let result = stores.value;

  if (filterRegion.value) {
    result = result.filter((s) => s.region === filterRegion.value);
  }
  if (filterCity.value) {
    result = result.filter((s) => s.city === filterCity.value);
  }

  return result;
});

// 用 window.open 開新分頁導向 Google 地圖搜尋，取代 <a target="_blank">
function openMap(store) {
  const query = encodeURIComponent(store.name + " " + store.address);
  const url = "https://www.google.com/maps/search/?api=1&query=" + query;
  window.open(url, "_blank", "noopener,noreferrer");
}

// 用 window.location.href 觸發撥號，取代 <a href="tel:...">
function callStore(store) {
  window.location.href = "tel:" + store.phone;
}
</script>