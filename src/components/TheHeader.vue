<template>
  <header class="header">
    <router-link to="/" class="logo">Drink Shop</router-link>
    <button class="hamburger" @click="toggleMenu" v-if="isMobile">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="nav" :class="{ active: showMenu }">
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
            @click.prevent="handleCategorySelect(cat)"
          >
            {{ cat }}
          </router-link>
        </div>
      </div>

      <router-link to="/cart">Giỏ hàng</router-link>
      <router-link to="/history">Lịch sử</router-link>

      <span v-if="user" class="user-info">
        👤 {{ user.username }} |
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

const logout = () => {
  store.commit("logout");
  router.push("/");
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  if (showMenu.value) {
    isDropdownOpen.value = false; // Đóng dropdown khi mở menu
  }
};

const handleMouseEnter = () => {
  if (!isMobile.value) {
    isDropdownOpen.value = true; // Mở dropdown khi hover trên desktop
  }
};

const handleMouseLeave = () => {
  if (!isMobile.value) {
    isDropdownOpen.value = false; // Ẩn dropdown khi rời hover trên desktop
  }
};

const toggleDropdown = () => {
  if (isMobile.value && showMenu.value) {
    isDropdownOpen.value = !isDropdownOpen.value; // Toggle dropdown trên mobile khi menu đã mở
  }
};

const handleCategorySelect = async (category) => {
  isDropdownOpen.value = false; // Ẩn dropdown
  if (isMobile.value) {
    showMenu.value = false; // Ẩn toàn bộ menu trên mobile
  }
  await nextTick(); // Đợi UI cập nhật
  router.push({ name: "Home", query: { category } }); // Chuyển hướng
};

// Cập nhật isMobile khi thay đổi kích thước màn hình
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

/* Mobile (dưới 768px) */
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
}

/* Tablet (768px - 1024px) */
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
}
</style>