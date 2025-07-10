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
html, body, #app {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* chiếm toàn bộ phần còn lại */
  padding: 2rem 1rem;
  background: #f8f8f8;
}
</style>

