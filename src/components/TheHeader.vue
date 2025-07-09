<template>
  <header class="header">
   <router-link to="/" class="logo">🍹 Drink Shop</router-link>
    <nav class="nav">
      <router-link to="/">Trang chủ</router-link>

      <div class="dropdown" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
        <span class="dropdown-title">Danh mục ▾</span>
        <div v-if="showMenu" class="dropdown-menu">
          <router-link
            v-for="cat in categories"
            :key="cat"
            :to="{ name: 'Home', query: { category: cat } }"
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
import { computed } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore();
const user = computed(() => store.state.user);
const showMenu = ref(false);
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
  store.commit('logout')
  router.push('/')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
}

.logo {
  font-weight: bold;
  font-size: 30px;
  text-decoration: none;
  color: #fff;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
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
  min-width: 160px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

.dropdown-menu a {
  padding: 0.5rem 1rem;
  color: #333;
}

.dropdown-menu a:hover {
  background: #eee;
}
</style>
