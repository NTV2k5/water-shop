<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>


<script setup>
import Header from './components/TheHeader.vue'
import Footer from './components/TheFooter.vue'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('fetchProducts')
})
</script>

<style>
html, body {
  height: 100%; /* Đảm bảo chiều cao đầy đủ */
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Ngăn cuộn ngang nếu có */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Đảm bảo chiều cao tối thiểu */
  position: relative; /* Đảm bảo context cho sticky */
}

.main-content {
  flex: 1; /* chiếm toàn bộ phần còn lại */
  padding: 2rem 1rem;
  background: #f8f8f8;
}
</style>

