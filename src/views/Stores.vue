<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-12 text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">門市查詢</h1>
        <p class="text-gray-600 text-lg">
          歡迎蒞臨 Luvo 全台門市，體驗精緻皮鞋工藝與專業服務
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 搜尋和篩選區 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 地區篩選 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >選擇地區</label
            >
            <select
              v-model="selectedRegion"
              @change="updateCities"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">全部地區</option>
              <option value="north">北部</option>
              <option value="central">中部</option>
              <option value="south">南部</option>
              <option value="east">東部</option>
            </select>
          </div>

          <!-- 城市篩選 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >選擇城市</label
            >
            <select
              v-model="selectedCity"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">全部城市</option>
              <option v-for="city in availableCities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <!-- 搜尋 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >關鍵字搜尋</label
            >
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="門市名稱或地址..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 搜尋結果統計 -->
        <div class="mt-4 text-sm text-gray-600">
          共找到
          <span class="font-bold text-amber-800">{{
            filteredStores.length
          }}</span>
          間門市
        </div>
      </div>

      <!-- 門市列表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="store in filteredStores"
          :key="store.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- 門市圖片 -->
          <div class="relative h-48 overflow-hidden bg-gray-200">
            <img
              :src="store.image"
              :alt="store.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute top-4 left-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  store.isOpen
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white',
                ]"
              >
                {{ store.isOpen ? "營業中" : "已打烊" }}
              </span>
            </div>
          </div>

          <!-- 門市資訊 -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">
                  {{ store.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ getRegionText(store.region) }} | {{ store.city }}
                </p>
              </div>
              <button
                @click="toggleFavorite(store.id)"
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                :title="isFavorite(store.id) ? '取消收藏' : '加入收藏'"
              >
                <svg
                  class="w-6 h-6"
                  :class="
                    isFavorite(store.id)
                      ? 'text-red-500 fill-current'
                      : 'text-gray-400'
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            <!-- 地址 -->
            <div class="flex items-start space-x-3 mb-3">
              <svg
                class="w-5 h-5 text-amber-800 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p class="text-gray-600 text-sm">{{ store.address }}</p>
            </div>

            <!-- 電話 -->
            <div class="flex items-center space-x-3 mb-3">
              <svg
                class="w-5 h-5 text-amber-800 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                :href="`tel:${store.phone}`"
                class="text-gray-600 text-sm hover:text-amber-800 transition-colors"
              >
                {{ store.phone }}
              </a>
            </div>

            <!-- 營業時間 -->
            <div class="flex items-start space-x-3 mb-4">
              <svg
                class="w-5 h-5 text-amber-800 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="text-sm">
                <p class="text-gray-600">平日：{{ store.hours.weekday }}</p>
                <p class="text-gray-600">假日：{{ store.hours.weekend }}</p>
              </div>
            </div>

            <!-- 服務標籤 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="service in store.services"
                :key="service"
                class="px-2 py-1 bg-amber-50 text-amber-800 text-xs rounded-full"
              >
                {{ service }}
              </span>
            </div>

            <!-- 操作按鈕 -->
            <div class="flex gap-2">
              <a
                :href="store.mapUrl"
                target="_blank"
                class="flex-1 px-4 py-2 bg-amber-800 text-white text-center rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Google 地圖
              </a>
              <a
                :href="`tel:${store.phone}`"
                class="px-4 py-2 border-2 border-amber-800 text-amber-800 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                撥打電話
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 無結果提示 -->
      <div v-if="filteredStores.length === 0" class="text-center py-16">
        <svg
          class="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p class="text-gray-500 text-lg">找不到符合條件的門市</p>
        <p class="text-gray-400 text-sm mt-2">請嘗試調整篩選條件</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const stores = ref([
  {
    id: 1,
    name: "Luvo 信義旗艦店",
    region: "north",
    city: "台北市",
    address: "台北市信義區信義路五段7號 2樓",
    phone: "02-2345-6789",
    hours: {
      weekday: "11:00 - 21:30",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "客製服務", "保養維修", "會員專區"],
    image: "/images/store-1.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 2,
    name: "Luvo 東區門市",
    region: "north",
    city: "台北市",
    address: "台北市大安區忠孝東路四段200號",
    phone: "02-2771-8888",
    hours: {
      weekday: "11:00 - 21:30",
      weekend: "11:00 - 22:00",
    },
    services: ["專業諮詢", "保養維修"],
    image: "/images/store-2.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 3,
    name: "Luvo 板橋大遠百",
    region: "north",
    city: "新北市",
    address: "新北市板橋區新站路16號 3樓",
    phone: "02-2964-5678",
    hours: {
      weekday: "11:00 - 22:00",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "客製服務", "會員專區"],
    image: "/images/store-3.png",
    mapUrl: "https://maps.google.com",
    isOpen: false,
  },
  {
    id: 4,
    name: "Luvo 中壢SOGO",
    region: "north",
    city: "桃園市",
    address: "桃園市中壢區元化路357號 4樓",
    phone: "03-425-1234",
    hours: {
      weekday: "11:00 - 21:30",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "保養維修"],
    image: "/images/store-4.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 5,
    name: "Luvo 台中中友百貨",
    region: "central",
    city: "台中市",
    address: "台中市北區三民路三段161號 6樓",
    phone: "04-2225-8888",
    hours: {
      weekday: "11:00 - 22:00",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "客製服務", "保養維修", "會員專區"],
    image: "/images/store-5.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 6,
    name: "Luvo 台中新光三越",
    region: "central",
    city: "台中市",
    address: "台中市西屯區台灣大道三段301號 5樓",
    phone: "04-2254-9999",
    hours: {
      weekday: "11:00 - 21:30",
      weekend: "11:00 - 22:00",
    },
    services: ["專業諮詢", "保養維修"],
    image: "/images/store-6.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 7,
    name: "Luvo 台南新天地",
    region: "south",
    city: "台南市",
    address: "台南市中西區西門路一段658號 3樓",
    phone: "06-303-5678",
    hours: {
      weekday: "11:00 - 22:00",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "客製服務", "會員專區"],
    image: "/images/store-7.png",
    mapUrl: "https://maps.google.com",
    isOpen: false,
  },
  {
    id: 8,
    name: "Luvo 高雄漢神巨蛋",
    region: "south",
    city: "高雄市",
    address: "高雄市左營區博愛二路777號 4樓",
    phone: "07-553-7777",
    hours: {
      weekday: "11:00 - 21:30",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "客製服務", "保養維修", "會員專區"],
    image: "/images/store-8.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 9,
    name: "Luvo 高雄夢時代",
    region: "south",
    city: "高雄市",
    address: "高雄市前鎮區中華五路789號 6樓",
    phone: "07-973-2345",
    hours: {
      weekday: "11:00 - 22:00",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "保養維修"],
    image: "/images/store-9.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
  {
    id: 10,
    name: "Luvo 花蓮遠百",
    region: "east",
    city: "花蓮縣",
    address: "花蓮縣花蓮市和平路581號 2樓",
    phone: "03-834-5678",
    hours: {
      weekday: "11:00 - 21:30",
      weekend: "10:30 - 22:00",
    },
    services: ["專業諮詢", "保養維修"],
    image: "/images/store-10.png",
    mapUrl: "https://maps.google.com",
    isOpen: true,
  },
]);

const selectedRegion = ref("");
const selectedCity = ref("");
const searchQuery = ref("");
const favorites = ref([]);

const regionCities = {
  north: ["台北市", "新北市", "桃園市", "新竹市"],
  central: ["台中市", "彰化縣", "南投縣"],
  south: ["台南市", "高雄市", "屏東縣"],
  east: ["宜蘭縣", "花蓮縣", "台東縣"],
};

const availableCities = computed(() => {
  if (!selectedRegion.value) {
    return [];
  }
  return regionCities[selectedRegion.value] || [];
});

const filteredStores = computed(() => {
  let result = stores.value;

  if (selectedRegion.value) {
    result = result.filter((store) => store.region === selectedRegion.value);
  }

  if (selectedCity.value) {
    result = result.filter((store) => store.city === selectedCity.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query),
    );
  }

  return result;
});

const updateCities = () => {
  selectedCity.value = "";
};

const getRegionText = (region) => {
  const regions = {
    north: "北部",
    central: "中部",
    south: "南部",
    east: "東部",
  };
  return regions[region] || region;
};

const isFavorite = (id) => {
  return favorites.value.includes(id);
};

const toggleFavorite = (id) => {
  const index = favorites.value.indexOf(id);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(id);
  }
};
</script>
