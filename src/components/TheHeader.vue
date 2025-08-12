<template>
  <header class="header">
    <router-link to="/" class="logo">Drink Shop</router-link>
    <button class="hamburger" @click="toggleMenu" v-if="isMobile">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="nav" :class="{ active: showMenu }">
      <div class="search-container">
        <input
          v-model="searchQuery"
          placeholder="Tìm kiếm sản phẩm..."
          @input="handleSearch"
          class="search-input"
        />
        <div v-if="suggestions.length && searchQuery" class="suggestions">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            @click="selectSuggestion(suggestion.name)"
            class="suggestion-item"
          >
            {{ suggestion.name }}
          </div>
        </div>
      </div>
      <router-link to="/">Trang chủ</router-link>

      <div
        class="dropdown"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="toggleDropdown"
        :class="{ 'desktop-open': isDropdownOpen && !isMobile }"
      >
        <span class="dropdown-title">Danh mục ▾</span>
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <router-link
            v-for="cat in categories"
            :key="cat"
            :to="{ name: 'Home', query: { category: cat } }"
            @click="handleCategorySelect(cat)"
          >
            {{ cat }}
          </router-link>
        </div>
      </div>

      <router-link to="/cart">Giỏ hàng</router-link>
      <router-link to="/history">Lịch sử</router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin">Quản lý</router-link>

      <span v-if="user" class="user-info">
         {{ user.username }} |
        <a href="#" @click.prevent="logout">Đăng xuất</a>
      </span>
      <router-link v-else to="/login">Đăng nhập</router-link>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const user = computed(() => store.state.user);
const showMenu = ref(false);
const isMobile = ref(window.innerWidth <= 767);
const isDropdownOpen = ref(false);

const categories = [
  "Trà sữa",
  "Cà phê",
  "Sinh tố",
  "Nước ngọt",
  "Trà trái cây",
  "Matcha",
  "Nước ép",
  "Trà kem cheese",
  "Socola",
];

const searchQuery = computed({
  get: () => store.state.searchQuery,
  set: (value) => store.commit("setSearchQuery", value),
});

const suggestions = computed(() => {
  const query = (searchQuery.value || "").toLowerCase();

  return (store.state.products || []).filter((p) => {
    const name = p.name || "";
    return name.toLowerCase().includes(query);
  });
});

const logout = () => {
  store.commit("logout");
  router.push("/");
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  if (showMenu.value) {
    isDropdownOpen.value = false;
  }
};

const handleMouseEnter = () => {
  if (!isMobile.value) {
    isDropdownOpen.value = true;
  }
};

const handleMouseLeave = () => {
  if (!isMobile.value) {
    isDropdownOpen.value = false;
  }
};

const toggleDropdown = () => {
  if (isMobile.value && showMenu.value) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const handleCategorySelect = async (category) => {
  isDropdownOpen.value = false;
  if (isMobile.value) {
    showMenu.value = false;
  }
  await nextTick();
  store.commit("setSearchQuery", "");
  router.push({ name: "Home", query: { category } });
};

const handleSearch = () => {
  store.commit("setCurrentPage", 1);
};

const selectSuggestion = (name) => {
  store.commit("setSearchQuery", name);
  store.commit("setCurrentPage", 1);
};

window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 767;
  if (!isMobile.value && showMenu.value) {
    showMenu.value = false;
    isDropdownOpen.value = false;
  }
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  color: #fff;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1rem;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 8px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #333;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
  color: #000;
}

.suggestion-item:hover {
  background: #f0f0f0;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-title {
  font-weight: 500;
}

.dropdown-menu {
  position: absolute;
  background: white;
  color: #333;
  top: 100%;
  left: 0;
  min-width: 150px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 0.5rem 0;
  display: none;
  flex-direction: column;
}

.dropdown.desktop-open .dropdown-menu {
  display: flex;
}

.dropdown-menu a {
  padding: 0.5rem 1rem;
  color: #333;
}

.dropdown-menu a:hover {
  background: #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background: white;
  transition: all 0.3s;
}

.nav.active {
  display: flex !important;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #2c3e50;
  padding: 1rem;
}

.nav.active a,
.nav.active .dropdown-title {
  color: white;
}

.nav.active .dropdown-menu {
  position: static;
  width: 100%;
  box-shadow: none;
  display: flex;
  background: #2c3e50;
}

.nav.active .dropdown-menu a {
  color: white;
}

@media (max-width: 767px) {
  .nav {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .nav.active {
    display: flex;
  }
  .logo {
    font-size: 1.2rem;
  }
  .nav a {
    font-size: 1rem;
  }
  .dropdown-menu {
    min-width: 100%;
  }
  .search-input {
    width: 100%;
    margin-bottom: 1rem;
  }
  .suggestions {
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .logo {
    font-size: 1.3rem;
  }
  .nav {
    gap: 1rem;
  }
  .nav a {
    font-size: 0.9rem;
  }
  .search-input {
    width: 150px;
  }
  .suggestions {
    width: 150px;
  }
}
</style>