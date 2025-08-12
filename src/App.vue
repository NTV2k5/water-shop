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
import Header from "./components/TheHeader.vue";
import Footer from "./components/TheFooter.vue";
import { onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchProducts");
  store.dispatch("fetchProductSizes");
  store.dispatch("fetchCategories");
  store.dispatch("fetchToppings"); // Thêm action fetch toppings
});
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
  background: #f8f8f8;
}
</style>