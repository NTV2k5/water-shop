// File: main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 👉 Khôi phục user từ localStorage nếu có
const savedUser = localStorage.getItem('user');
if (savedUser) {
  try {
    store.commit('setUser', JSON.parse(savedUser));
  } catch (err) {
    console.error("Lỗi khôi phục user:", err);
  }
}

// Load dữ liệu
store.dispatch('fetchProducts');
store.dispatch('fetchProductSizes');
store.dispatch('fetchCategories');
store.dispatch('fetchToppings'); // bạn có thể thêm cái này tại đây luôn

// Mount app
createApp(App).use(router).use(store).mount('#app');
